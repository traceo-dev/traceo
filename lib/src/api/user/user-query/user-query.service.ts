import { Injectable, Logger } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { User } from "../../../db/entities/user.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { IUser, Notification } from "@traceo/types";
import { RequestContext } from "../../../common/middlewares/request-context/request-context.model";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";

@Injectable()
export class UserQueryService extends BaseQueryService<User, BaseDtoQuery> {
  private logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly clickhouseService: ClickhouseService
  ) {
    super(entityManager, User);

    this.logger = new Logger(UserQueryService.name);
  }

  public async getSignedInUser(): Promise<ApiResponse<IUser>> {
    try {
      const userId = RequestContext.user.id;
      if (!userId) {
        throw new Error(`[${this.getSignedInUser.name}] No user ID!`);
      }

      const user = await this.entityManager.getRepository(User).findOneBy({
        id: userId
      });

      return new ApiResponse("success", undefined, user);
    } catch (error) {
      throw new Error(`[${this.getSignedInUser.name}] Caused by: ${error}`);
    }
  }

  public get builderAlias(): string {
    return "user";
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<User>,
    query: BaseDtoQuery
  ): SelectQueryBuilder<User> {
    const { search } = query;

    if (search) {
      builder
        .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${search}%` })
        .orWhere("LOWER(user.username) LIKE LOWER(:username)", {
          username: `%${search}%`
        })
        .orWhere("LOWER(user.email) LIKE LOWER(:email)", {
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
      "isPasswordUpdated"
    ];
  }

  public async getUserNotifications() {
    try {
      const userId = RequestContext.user.id;
      const notifications: Notification[] = await this.clickhouseService.loadUserNotifications(
        userId
      );

      return new ApiResponse("success", undefined, notifications);
    } catch (error) {
      this.logger.error(`[${this.getUserNotifications.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }
}
