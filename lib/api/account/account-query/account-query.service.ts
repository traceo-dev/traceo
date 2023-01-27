import { Injectable } from '@nestjs/common';
import { BaseQueryService } from '../../../common/base/query/base-query.service';
import { BaseDtoQuery } from '../../../common/base/query/base-query.model';
import { Account } from '../../../db/entities/account.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { ApiResponse } from 'lib/common/types/dto/response.dto';
import { IAccount } from 'lib/common/types/interfaces/account.interface';
import { RequestContext } from 'lib/common/middlewares/request-context/request-context.model';

@Injectable()
export class AccountQueryService extends BaseQueryService<
  Account,
  BaseDtoQuery
> {
  constructor(
    private readonly entityManager: EntityManager
  ) {
    super(entityManager, Account);
  }

  public async getSignedInAccount(): Promise<ApiResponse<IAccount>> {
    try {
      const accountId = RequestContext.user.id;
      const account = await this.entityManager.getRepository(Account).findOneBy({
        id: accountId
      });

      return new ApiResponse("success", undefined, account)
    } catch (error) {
      console.log("erro: ", error)
    }
  }

  public get builderAlias(): string {
    return 'account';
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Account>,
    query: BaseDtoQuery,
  ): SelectQueryBuilder<Account> {
    const { search } = query;

    if (search) {
      builder
        .where("LOWER(account.name) LIKE LOWER(:name)", { name: `%${search}%` })
        .orWhere("LOWER(account.username) LIKE LOWER(:username)", {
          username: `%${search}%`
        })
        .orWhere("LOWER(account.email) LIKE LOWER(:email)", {
          email: `%${search}%`
        });
    }

    return builder;
  }

  public selectedColumns(): string[] {
    return [
      "id",
      "name",
      "username",
      "email",
      "gravatar",
      "status",
      "isAdmin",
      "isPasswordUpdated",
    ];
  }
}
