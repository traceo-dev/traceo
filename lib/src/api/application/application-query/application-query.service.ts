import { Injectable, Logger } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { LogsQuery, ILog } from "@traceo/types";
import { Project } from "../../../db/entities/project.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";

@Injectable()
export class ApplicationQueryService extends BaseQueryService<Project, BaseDtoQuery> {
  private logger: Logger;

  constructor(
    readonly entityManager: EntityManager,
    readonly clickhouseClient: ClickhouseService
  ) {
    super(entityManager, Project);
    this.logger = new Logger(ApplicationQueryService.name);
  }

  public override async getApiDto(id: string): Promise<ApiResponse<Project>> {
    const resp = await this.entityManager.getRepository(Project)
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .loadRelationCountAndMap("project.incidentsCount", "project.incidents")
      .getOne();

    return new ApiResponse("success", undefined, resp);
  }

  public get builderAlias(): string {
    return "project";
  }

  public async checkAppExists(id: string) {
    const app = await this.getDto(id);
    if (!app) {
      throw new Error(`Application with ID: ${id} does not exists!`);
    }
    return app;
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Project>,
    query: BaseDtoQuery
  ): SelectQueryBuilder<Project> {
    const { search } = query;

    if (search) {
      builder.where("LOWER(project.name) LIKE LOWER(:name)", {
        name: `%${search}%`
      });
    }

    builder
      .leftJoinAndSelect("project.owner", "owner")
      .loadRelationCountAndMap("project.membersCount", "project.members")
      .loadRelationCountAndMap("project.incidentsCount", "project.incidents")
      .addSelect("owner.name", "owner.email");

    return builder;
  }

  public selectedColumns(): string[] {
    return ["id", "name", "gravatar", "lastEventAt", "isIntegrated"];
  }

  public async getApplicationLogs(query: LogsQuery): Promise<ApiResponse<ILog[]>> {
    if (!query.levels || query.levels.length === 0) {
      return new ApiResponse("success", undefined, []);
    }

    try {
      const logs = await this.clickhouseClient.loadLogs(query);
      return new ApiResponse("success", undefined, logs);
    } catch (error) {
      this.logger.error(`[${this.getApplicationLogs.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
