import { Injectable, Logger } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { ApplicationLogsQuery, ILog } from "../../../common/types/interfaces/log.interface";
import { Application } from "../../../db/entities/application.entity";
import { Log } from "../../../db/entities/log.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";


@Injectable()
export class ApplicationQueryService extends BaseQueryService<
  Application,
  BaseDtoQuery
> {
  private logger: Logger;

  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Application);
    this.logger = new Logger(ApplicationQueryService.name);
  }

  public get builderAlias(): string {
    return 'application';
  }

  public async checkAppExists(id: string) {
    const app = await this.getDto(id);
    if (!app) {
      throw new Error(`Application with ID: ${id} does not exists!`);
    }
    return app;
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Application>,
    query: BaseDtoQuery,
  ): SelectQueryBuilder<Application> {
    const { search } = query;

    if (search) {
      builder.where("LOWER(application.name) LIKE LOWER(:name)", {
        name: `%${search}%`
      });
    }

    builder
      .leftJoinAndSelect('application.owner', 'owner')
      .loadRelationCountAndMap(
        "application.membersCount",
        "application.members",
      )
      .addSelect('owner.name', 'owner.email');

    return builder;
  }

  public selectedColumns(): string[] {
    return ["id", "name", "gravatar", "lastIncidentAt", "incidentsCount", "connectedTSDB", "isIntegrated"];
  }

  public async getApplicationLogs(query: ApplicationLogsQuery): Promise<ApiResponse<ILog[]>> {
    const { startDate, endDate, id } = query;

    if (!id) {
      throw new Error(`[${this.getApplicationLogs.name}] Application ID is required!`);
    }

    try {
      const response = await this.entityManager.getRepository(Log).createQueryBuilder('log')
        .where('log.applicationId = :id', { id })
        .andWhere('log.receiveTimestamp > :startDate', { startDate })
        .andWhere('log.receiveTimestamp < :endDate', { endDate })
        .orderBy('log.receiveTimestamp', 'DESC', "NULLS LAST")
        .select(['log.timestamp', 'log.message', 'log.level', 'log.resources', 'log.receiveTimestamp'])
        .take(1000)
        .getMany();

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getApplicationLogs.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
