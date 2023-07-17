import { Injectable, Logger } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { Project } from "../../../db/entities/project.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";

@Injectable()
export class ProjectQueryService extends BaseQueryService<Project, BaseDtoQuery> {
  private logger: Logger;

  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Project);
    this.logger = new Logger(ProjectQueryService.name);
  }

  public override async getApiDto(id: string): Promise<ApiResponse<Project>> {
    const resp = await this.entityManager
      .getRepository(Project)
      .createQueryBuilder("project")
      .where("project.id = :id", { id })
      .loadRelationCountAndMap("project.incidentsCount", "project.incidents")
      .getOne();

    return new ApiResponse("success", undefined, resp);
  }

  public get builderAlias(): string {
    return "project";
  }

  public async checkProjectExists(id: string) {
    const project = await this.getDto(id);
    if (!project) {
      throw new Error(`Project with ID: ${id} does not exists!`);
    }
    return project;
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
    return ["name", "gravatar", "lastEventAt", "isIntegrated"];
  }
}
