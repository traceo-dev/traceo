import { Injectable, Logger } from '@nestjs/common';
import { Account } from '../db/entities/account.entity';
import {
  AccountEmailAlreadyExistsError,
  AccountWithUsernameAlreadyExistsError,
  InternalServerError
} from '../helpers/errors';
import tokenService from '../helpers/tokens';
import { EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AccountQueryService } from './account-query/account-query.service';
import { AmrService } from '../application-member/amr.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { HttpService } from "@nestjs/axios";
import dateUtils from '../helpers/dateUtils';
import { ADMIN_EMAIL, INTERNAL_SERVER_ERROR } from '../helpers/constants';
import { AccountPermissionService } from './account-permission/account-permission.service';
import { gravatar } from '../../lib/helpers/gravatar';
import { AccountStatus } from '../../lib/types/enums/account.enum';
import { AccountDto, CreateAccountDto } from '../../lib/types/dto/account.dto';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@Injectable()
export class AccountService {
  private readonly logger: Logger;

  constructor(
    readonly entityManager: EntityManager,
    readonly accountQueryService: AccountQueryService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly awrService: AmrService,
    readonly httpService: HttpService,
    readonly accountPermission: AccountPermissionService
  ) {
    this.logger = new Logger(AccountService.name);
  }

  private async checkDuplicate(username: string, email: string) {
    const account = await this.accountQueryService.getDtoBy({
      username: username && username.toLowerCase()
    });
    if (account) {
      throw new AccountWithUsernameAlreadyExistsError();
    }

    if (email) {
      const account = await this.accountQueryService.getDtoBy({ email });
      if (account) {
        throw new AccountEmailAlreadyExistsError();
      }
    }
  }

  public async createAccount(accountDto: CreateAccountDto): Promise<any> {
    const { name, email, password, username } = accountDto;

    await this.checkDuplicate(username, email);

    try {
      const url = gravatar.url(username || email, "retro");
      const account: QueryDeepPartialEntity<Account> = {
        email,
        name,
        username: username.toLowerCase(),
        password: tokenService.generate(password),
        isAdmin: false,
        gravatar: url,
        status: AccountStatus.INACTIVE,
        createdAt: dateUtils.toUnix()
      };

      await this.entityManager.getRepository(Account).insert(account);

      return new ApiResponse("success", "New account has been created");
    } catch (error) {
      this.logger.error(`[${this.createAccount.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async updateAccountApi(
    accountId: string,
    accountDto: AccountDto,
  ): Promise<ApiResponse<unknown>> {
    const { id, ...rest } = accountDto;

    if (rest.email === ADMIN_EMAIL) {
      return new ApiResponse("error", "The administrator account cannot be modified")
    }

    try {
      if (!accountDto.id) {
        await this.updateAccount(accountId, accountDto);
        return new ApiResponse("success", "Account updated")
      }

      await this.updateServerAccount(accountDto);
      return new ApiResponse("success", "Account updated");
    } catch (err) {
      this.logger.error(`[${this.updateAccountApi.name}] Caused by: ${err}`)
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateAccount(accountId: string, accountDto: AccountDto) {
    await this.entityManager.getRepository(Account).update({ id: accountId }, accountDto);
  }

  private async updateServerAccount(accountDto: AccountDto) {
    await this.entityManager.getRepository(Account).update({ id: accountDto.id }, accountDto);
  }

  public async deleteAccount(id: string, user: RequestUser): Promise<ApiResponse<unknown>> {
    return this.entityManager.transaction(async (manager) => {
      const account = await manager
        .getRepository(Account)
        .findOneBy({ id: user.id });

      if (!account.isAdmin) {
        return new ApiResponse("error", "Only users with admin role can remove account")
      }

      await manager
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('account.id = :id', { id })
        .delete()
        .execute();

      return new ApiResponse("success", "Account successfully removed");
    }).catch((err: Error) => {
      this.logger.error(`[${this.deleteAccount.name}] Caused by: ${err}`)
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }
}
