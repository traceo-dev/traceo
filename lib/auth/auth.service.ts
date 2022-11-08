import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AccountService } from '../account/account.service';
import { Account, AccountStatus } from '../db/entities/account.entity';
import {
  AccountCredentialsDto,
  RequestUser,
  UpdatePasswordDto
} from './auth.model';
import { JwtService } from "@nestjs/jwt";
import { EntityManager } from 'typeorm';
import {
  AccountNotExistsError,
  AccountSuspendedError,
  BadPasswordOrNotExists
} from '../helpers/errors';
import { JwtPayload } from './jwt/jwt.payload.interface';
import { AccountQueryService } from 'lib/account/account-query/account-query.service';

type LoginResponseType = { accessToken: string };
type CheckCredentialsType = { isCorrect: boolean; account?: Account };

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountQueryService: AccountQueryService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) { }

  public async login(
    accountCredentials: AccountCredentialsDto,
  ): Promise<LoginResponseType> {
    return await this.entityManager.transaction(async (manager) => {
      const { isCorrect, account } = await this.checkCredentials(
        accountCredentials,
        manager,
      );
      if (!isCorrect) {
        throw new BadPasswordOrNotExists();
      }

      if (!account?.lastActiveAt) {
        await this.accountService.updateAccount(account.id, {
          status: AccountStatus.ACTIVE
        });
      }

      if (account.status === AccountStatus.DISABLED) {
        throw new AccountSuspendedError();
      }

      const { id, name, email, username } = account;
      const payload: JwtPayload = {
        id,
        name,
        email,
        username
      };
      const accessToken = this.createToken(payload);
      return {
        accessToken
      };
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
    currentUser: RequestUser,
    passwords: UpdatePasswordDto,
  ): Promise<void> {
    const { id } = currentUser;
    const { newPassword, password } = passwords;

    await this.entityManager.transaction(async (manager) => {
      const account = await this.accountQueryService.getDto(id);
      if (!account) {
        throw new AccountNotExistsError();
      }

      const credentials = new AccountCredentialsDto(account?.email, password);
      const { isCorrect } = await this.checkCredentials(credentials, manager);
      if (!isCorrect) {
        throw new BadPasswordOrNotExists();
      }

      await manager.getRepository(Account).save({
        ...account,
        password: createHmac('sha256', newPassword).digest('hex'),
        isPasswordUpdated: true
      });

      return {
        status: 200,
        data: "Password updated!",
      };
    });
  }

  private createToken(
    payload: JwtPayload,
  ): string {
    return this.jwtService.sign(payload);
  }
}
