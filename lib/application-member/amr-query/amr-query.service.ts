import { Injectable, Logger } from '@nestjs/common';
import { BaseDtoQuery } from '../../core/query/generic.model';
import { AccountMemberRelationship } from '../../db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { ApplicationDtoQuery } from '../../../lib/types/dto/application.dto';
import { IApplicationResponse } from '../../../lib/types/interfaces/application.interface';
import { RequestUser } from '../../../lib/types/interfaces/account.interface';
import { ApiResponse } from '../../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../../lib/helpers/constants';

@Injectable()
export class AmrQueryService {
  private logger: Logger;
  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(AmrQueryService.name);
  }

  /**
   * Return pageable list of the members assigned to app
   *
   * @param appId
   * @param pageOptionsDto
   * @returns
   */
  public async getApplicationMembers(
    appId: string,
    pageOptionsDto: BaseDtoQuery,
  ): Promise<ApiResponse<AccountMemberRelationship[]>> {
    const { order, take, search, page } = pageOptionsDto;

    try {
      const queryBuilder = this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder('amr')
        .innerJoin('amr.application', 'app', 'app.id = :appId', { appId })
        .leftJoin('amr.account', 'account');

      if (search) {
        queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", {
          name: `%${search}%`
        });
      }

      queryBuilder
        .addSelect([
          "account.name",
          "account.email",
          "account.id",
          "account.gravatar",
        ])
        .orderBy("amr.createdAt", order, "NULLS LAST")
        .skip((page - 1) * take)
        .take(take);

      const response = await queryBuilder.getMany();
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationMembers.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Return pageable list of the Apps assigned to account
   *
   * @param accountId
   * @param pageOptionsDto
   * @returns
   */

  public async getApplicationsForAccount(
    accountId: string,
    pageOptionsDto: ApplicationDtoQuery
  ): Promise<ApiResponse<AccountMemberRelationship[]>> {
    const { page, take, order, search, sortBy } = pageOptionsDto;

    try {
      const queryBuilder = this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder("amr")
        .innerJoin("amr.account", "account", "account.id = :accountId", { accountId })
        .leftJoinAndSelect("amr.application", "application")
        .loadRelationCountAndMap("application.incidentsCount", "application.incidents")
        .leftJoin("application.owner", "owner");

      if (search) {
        queryBuilder
          .where("LOWER(application.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          })
          .orWhere("LOWER(owner.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          });
      }

      const response = await queryBuilder
        .addSelect(["owner.name", "owner.email", "owner.id", "owner.gravatar"])
        .orderBy(`application.${sortBy || "lastIncidentAt"}`, order, "NULLS LAST")
        .skip((page - 1) * take)
        .limit(take)
        .getMany();

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationsForAccount.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async awrExists(
    { accountId, applicationId }: { accountId: string; applicationId: string },
    manager: EntityManager = this.entityManager,
  ): Promise<boolean> {
    const count = await manager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder("amr")
      .where('amr.account = :accountId AND amr.application = :applicationId', { accountId, applicationId })
      .getCount();
    return count > 0;
  }

  public async getApplication(
    appId: string,
    user: RequestUser,
  ): Promise<ApiResponse<IApplicationResponse>> {
    const { id } = user;

    try {
      const applicationQuery = await this.entityManager
        .getRepository(AccountMemberRelationship)
        .createQueryBuilder("amr")
        .where('amr.application = :appId', { appId })
        .innerJoin("amr.account", "account", "account.id = :id", { id })
        .innerJoinAndSelect("amr.application", "application")
        .innerJoinAndSelect("application.owner", "owner")
        .getOne();

      if (!applicationQuery) {
        return new ApiResponse("success", undefined, []);
      }

      const response = this.mapApplicationResponse(applicationQuery);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplication.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  private mapApplicationResponse({ application, role }: AccountMemberRelationship): IApplicationResponse {
    const { influxDS } = application;

    return {
      ...application,
      influxDS: {
        ...influxDS,
        connStatus: influxDS?.connStatus,
        connError: influxDS?.connError
      },
      member: {
        role
      },
      owner: {
        name: application.owner.name
      }
    }
  }
}
