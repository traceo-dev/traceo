import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { AccountService } from 'src/account/account.service';
import { Account, AccountStatus } from 'src/db/entities/account.entity';
import {
  AccountCredentialsDto,
  RequestUser,
  UpdatePasswordDto
} from './auth.model';
import { JwtPayload } from './jwt.payload.interface';
import { JwtService } from "@nestjs/jwt";
import { EntityManager } from 'typeorm';
import {
  AccountNotExistsError,
  AccountSuspendedError,
  BadPasswordOrNotExists
} from 'src/helpers/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {}

  public async login(
    accountCredentials: AccountCredentialsDto,
  ): Promise<{ accessToken: string }> {
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
      const { accessToken } = await this.createToken(payload);
      return {
        accessToken
      };
    });
  }

  public async checkCredentials(
    credentials: AccountCredentialsDto,
    manager: EntityManager = this.entityManager,
  ): Promise<{ isCorrect: boolean; account?: Account }> {
    const { usernameOrEmail, password } = credentials;

    const account = await manager
      .getRepository(Account)
      .createQueryBuilder('account')
      .where('account.email = :email', { email: usernameOrEmail })
      .orWhere('account.username = :username', { username: usernameOrEmail })
      .andWhere("account.password = :password", {
        password: createHmac("sha256", password).digest("hex")
      })
      .getOne();

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
  ): Promise<any> {
    const { id } = currentUser;
    const { newPassword, password } = passwords;

    await this.entityManager.transaction(async (manager) => {
      const account = await manager
        .getRepository(Account)
        .findOneByOrFail({ id });

      if (!account) {
        throw new AccountNotExistsError();
      }

      const credentials = new AccountCredentialsDto(
        account?.email || account?.username,
        password,
      );

      const correctPassword = await this.checkCredentials(credentials, manager);
      if (!correctPassword.isCorrect) {
        throw new BadPasswordOrNotExists();
      }

      account.password = createHmac('sha256', newPassword).digest('hex');
      account.isPasswordUpdated = true;
      await manager.getRepository(Account).save(account);

      return {
        status: 200,
        data: "Password updated!",
      };
    });
  }

  public async createToken(
    payload: JwtPayload,
  ): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
