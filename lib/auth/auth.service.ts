import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AccountService } from '../account/account.service';
import { Account } from '../db/entities/account.entity';
import { JwtService } from "@nestjs/jwt";
import { EntityManager } from 'typeorm';
import {
  AccountNotExistsError
} from '../helpers/errors';
import { JwtPayload } from './jwt/jwt.payload.interface';
import { AccountQueryService } from '../../lib/account/account-query/account-query.service';
import { AccountStatus } from '../../lib/types/enums/account.enum';
import { AccountCredentialsDto, UpdatePasswordDto } from '../../lib/types/dto/account.dto';
import { IAccount, RequestUser } from '../../lib/types/interfaces/account.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../lib/helpers/constants';

export type LoginResponseType = { accessToken: string };
export type CheckCredentialsType = { isCorrect: boolean; account?: IAccount };

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private readonly accountService: AccountService,
    private readonly accountQueryService: AccountQueryService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  public async login(
    accountCredentials: AccountCredentialsDto,
  ) {
    return this.entityManager.transaction(async (manager) => {
      const { isCorrect, account } = await this.checkCredentials(
        accountCredentials,
        manager,
      );
      if (!isCorrect) {
        return new ApiResponse("error", "Bad username or password");
      }

      if (!account?.lastActiveAt) {
        await this.accountService.updateAccount(account.id, {
          status: AccountStatus.ACTIVE
        });
      }

      if (account.status === AccountStatus.DISABLED) {
        return new ApiResponse("error", "Account suspended. Contact with administrator");
      }

      const { id, name, username } = account;
      const payload: JwtPayload = {
        id,
        name,
        username
      };
      const accessToken = this.createToken(payload);

      return new ApiResponse("success", "", { accessToken });
    }).catch((err: Error) => {
      this.logger.error(`[${this.login.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async checkUserCredentials(credentials: AccountCredentialsDto): Promise<ApiResponse<unknown>> {
    const response = await this.checkCredentials(credentials);
    const status = response.isCorrect ? "success" : "error";
    const message = !response.isCorrect ? "Wrong password" : null;

    return new ApiResponse(status, message);
  }

  public async checkCredentials(
    credentials: AccountCredentialsDto,
    manager: EntityManager = this.entityManager,
  ): Promise<CheckCredentialsType> {
    const { username, password } = credentials;

    const account = await manager.getRepository(Account).findOne({
      where: {
        username,
        password: createHmac("sha256", password).digest("hex")
      }
    });

    if (!account) {
      return {
        isCorrect: false
      };
    }

    return {
      isCorrect: true,
      account
    };
  }

  public async updateUserPassword(
    currentUser: RequestUser,
    passwords: UpdatePasswordDto,
  ): Promise<ApiResponse<unknown>> {
    const { id } = currentUser;
    const { newPassword, password } = passwords;

    return this.entityManager.transaction(async (manager) => {
      const account = await this.accountQueryService.getDto(id);
      if (!account) {
        throw new AccountNotExistsError();
      }

      const credentials = new AccountCredentialsDto(account?.username, password);
      const { isCorrect } = await this.checkCredentials(credentials, manager);
      if (!isCorrect) {
        return new ApiResponse("error", "Bad password!");
      }

      await manager.getRepository(Account).save({
        ...account,
        password: createHmac('sha256', newPassword).digest('hex'),
        isPasswordUpdated: true
      });

      return new ApiResponse("success", "Password updated");
    }).catch((err: Error) => {
      this.logger.error(`[${this.updateUserPassword.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  private createToken(
    payload: JwtPayload,
  ): string {
    return this.jwtService.sign(payload);
  }
}
