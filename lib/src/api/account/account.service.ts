import { Injectable, Logger } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AccountQueryService } from './account-query/account-query.service';
import { AmrService } from '../application-member/amr.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { HttpService } from "@nestjs/axios";
import { GuardsService } from "@common/guards/guards.service";
import { INTERNAL_SERVER_ERROR, ADMIN_EMAIL } from "@common/helpers/constants";
import dateUtils from "@common/helpers/dateUtils";
import { AccountWithUsernameAlreadyExistsError, AccountEmailAlreadyExistsError } from "@common/helpers/errors";
import { gravatar } from "@common/helpers/gravatar";
import tokenService from "@common/helpers/tokens";
import { CreateAccountDto, AccountDto } from '@common/types/dto/account.dto';
import { Account } from '@db/entities/account.entity';
import { EntityManager } from 'typeorm';
import { AccountStatus } from "@traceo/types";
import { ApiResponse } from "@common/types/dto/response.dto";
import { RequestContext } from '@common/middlewares/request-context/request-context.model';
import { AuthTokenService } from 'src/auth/auth-token.service';


@Injectable()
export class AccountService {
  private readonly logger: Logger;

  constructor(
    readonly entityManager: EntityManager,
    readonly accountQueryService: AccountQueryService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly awrService: AmrService,
    readonly httpService: HttpService,
    readonly accountPermission: GuardsService,
    readonly tokenService: AuthTokenService
  ) {
    this.logger = new Logger(AccountService.name);
  }

  public async createAccount(accountDto: CreateAccountDto): Promise<any> {
    const { name, email, password, username } = accountDto;

    await this.checkDuplicate(username, email);

    try {
      const url = gravatar.url(username || email, "retro");
      const payload: Partial<Account> = {
        email,
        name,
        username: username.toLowerCase(),
        password: tokenService.generate(password),
        isAdmin: false,
        gravatar: url,
        status: AccountStatus.INACTIVE,
        createdAt: dateUtils.toUnix()
      };

      const account = await this.entityManager.getRepository(Account).save(payload);

      return new ApiResponse("success", "New account has been created", {
        id: account.id
      });
    } catch (error) {
      this.logger.error(`[${this.createAccount.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async updateAccountApi(
    accountDto: AccountDto,
  ): Promise<ApiResponse<unknown>> {
    const { email } = accountDto;

    if (email === ADMIN_EMAIL) {
      return new ApiResponse("error", "The administrator account cannot be modified")
    }

    try {
      await this.updateAccount(accountDto);
      return new ApiResponse("success", "Account updated")
    } catch (err) {
      this.logger.error(`[${this.updateAccountApi.name}] Caused by: ${err}`)
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateAccount(accountDto: AccountDto) {
    const { id, ...rest } = accountDto;
    await this.entityManager.getRepository(Account).update({ id: accountDto.id }, { ...rest });
  }

  public async deleteAccount(id: string): Promise<ApiResponse<unknown>> {
    const userId = RequestContext.user.id;
    return this.entityManager.transaction(async (manager) => {
      const account = await manager
        .getRepository(Account)
        .findOneBy({ id: userId });

      if (!account.isAdmin) {
        return new ApiResponse("error", "Only users with admin role can remove account")
      }

      await this.tokenService.revokeAllUserTokens(id, manager);

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
}
