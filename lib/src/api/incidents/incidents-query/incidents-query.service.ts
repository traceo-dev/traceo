import { Injectable } from "@nestjs/common";
import { BaseQueryService } from "../../../common/base/query/base-query.service";
import { IncidentQueryDto } from "../../../common/types/dto/incident.dto";
import { Incident } from "../../../db/entities/incident.entity";
import { Brackets, EntityManager, SelectQueryBuilder } from "typeorm";
import { IncidentStatusSearch } from "@traceo/types";

@Injectable()
export class IncidentsQueryService extends BaseQueryService<Incident, IncidentQueryDto> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Incident);
  }

  override async getDto(id: string): Promise<Incident> {
    return await this.repository
      .createQueryBuilder("incident")
      .where("incident.id = :id", { id })
      .leftJoin("incident.assigned", "assigned")
      .loadRelationCountAndMap("incident.commentsCount", "incident.comments")
      .loadRelationCountAndMap("incident.eventsCount", "incident.events")
      .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.gravatar"])
      .getOne();
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Incident>,
    query: IncidentQueryDto
  ): SelectQueryBuilder<Incident> {
    const { projectId } = query;

    builder
      .where("incident.project_id = :projectId", { projectId })
      .leftJoin("incident.assigned", "assigned")
      .loadRelationCountAndMap("incident.commentsCount", "incident.comments")
      .loadRelationCountAndMap("incident.eventsCount", "incident.events")
      .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.gravatar"]);

    this.commonQuery(builder, query);

    return builder;
  }

  public get builderAlias(): string {
    return "incident";
  }

  public selectedColumns(): string[] {
    return ["id", "status", "name", "message", "lastEventAt"];
  }

  public commonQuery(builder: SelectQueryBuilder<Incident>, query: IncidentQueryDto) {
    const { search, status, size } = query;

    if (status && status !== IncidentStatusSearch.ALL) {
      builder.andWhere("incident.status = :status", { status });
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where("LOWER(incident.message) LIKE LOWER(:search)", {
            search: `%${search}%`
          })
            .orWhere("LOWER(incident.name) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(incident.status) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(assigned.name) LIKE LOWER(:search)", {
              search: `%${search}%`
            });
        })
      );
    }

    if (size) {
      builder.limit(size);
    }
  }
}
