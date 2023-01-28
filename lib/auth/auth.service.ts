import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Response, Request } from "express";
import { Account } from '../db/entities/account.entity';
import { JwtService } from "@nestjs/jwt";
import { EntityManager } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { AccountQueryService } from '../api/account/account-query/account-query.service';
import { AccountService } from '../api/account/account.service';
import { INTERNAL_SERVER_ERROR, SESSION_EXPIRY_TIME, SESSION_NAME } from '../common/helpers/constants';
import { AccountNotExistsError } from '../common/helpers/errors';
import { AccountCredentialsDto, UpdatePasswordDto } from '../common/types/dto/account.dto';
import { IAccount } from '../common/types/interfaces/account.interface';
import { ApiResponse } from '../common/types/dto/response.dto';
import { AccountStatus } from '../common/types/enums/account.enum';
import { AuthTokenService } from './auth-token.service';
import { RequestContext } from '@common/middlewares/request-context/request-context.model';

export type LoginResponseType = { accessToken: string };
export type CheckCredentialsType = { isCorrect: boolean; account?: IAccount };

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private readonly accountService: AccountService,
    private readonly accountQueryService: AccountQueryService,
    private readonly authTokenService: AuthTokenService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  public async login(
    accountCredentials: AccountCredentialsDto,
    res: Response,
    req: Request
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
        await this.accountService.updateAccountApi({
          id: account.id,
          status: AccountStatus.ACTIVE
        });
      }

      if (account.status === AccountStatus.DISABLED) {
        return new ApiResponse("error", "Account suspended. Contact with administrator of this Traceo Platform.");
      }

      const sessionId = await this.authTokenService.createUserToken({
        accountID: account.id,
        accountName: account.name
      }, req);

      res.cookie(SESSION_NAME, sessionId, {
        maxAge: SESSION_EXPIRY_TIME
      });

      return new ApiResponse("success", undefined, null);
    }).catch((err: Error) => {
      this.logger.error(`[${this.login.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async logout(req: Request, res: Response): Promise<ApiResponse<unknown>> {
    const sessionID = req.cookies[SESSION_NAME];
    if (!sessionID) {
      this.logger.error(`[${this.logout.name}] No session ID!`);
      return;
    }

    try {
      await this.authTokenService.revokeUserToken(sessionID);

      res.clearCookie(SESSION_NAME);
      return new ApiResponse("success", undefined, {
        redirectUrl: "/"
      });
    } catch (error) {
      this.logger.error(`[${this.logout.name}] Caused by: ${error}`);
    }
  }

  public async checkUserCredentials(credentials: AccountCredentialsDto): Promise<ApiResponse<unknown>> {
    const { username } = RequestContext.user;
    const response = await this.checkCredentials({
      username,
      password: credentials.password
    });
    return new ApiResponse("success", undefined, {
      isCorrect: response.isCorrect
    });
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
    passwords: UpdatePasswordDto
  ): Promise<ApiResponse<unknown>> {
    const { id } = RequestContext.user;
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
