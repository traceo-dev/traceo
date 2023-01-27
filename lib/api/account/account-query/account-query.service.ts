import { Injectable } from '@nestjs/common';
import { BaseQueryService } from '../../../common/base/query/base-query.service';
import { BaseDtoQuery } from '../../../common/base/query/base-query.model';
import { Account } from '../../../db/entities/account.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Request } from "express";
import { ApiResponse } from 'lib/common/types/dto/response.dto';
import { IAccount } from 'lib/common/types/interfaces/account.interface';
import { Session } from 'lib/db/entities/session.entity';

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

  public async getSignedInAccount(req: Request): Promise<ApiResponse<IAccount>> {
    const sessionId = req.cookies.traceo_session;
    if (!sessionId) {
      return new ApiResponse("error", "User not logged in!", null);
    }

    try {
      const session = await this.entityManager.getRepository(Session).findOneBy({
        sessionID: sessionId
      });

      if (!session) {
        throw new Error("Session not found!");
      }

      const accountId = session.accountID;
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
