import { Injectable } from "@nestjs/common";
import { GenericQueryService } from "../../core/query/generic-query.service";
import { Incident } from "../../db/entities/incident.entity";
import { Brackets, EntityManager, SelectQueryBuilder } from "typeorm";
import { IncidentQueryDto } from "../../../lib/types/dto/incident.dto";
import { IncidentStatusSearch } from "../../../lib/types/enums/incident.enum";

@Injectable()
export class IncidentsQueryService extends GenericQueryService<
  Incident,
  IncidentQueryDto
> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Incident);
  }

  override async getDto(id: string): Promise<Incident> {
    return await this.repository
      .createQueryBuilder("incident")
      .where("incident.id = :id", { id })
      .leftJoin("incident.assigned", "assigned")
      .loadRelationCountAndMap("incident.commentsCount", "incident.comments")
      .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.gravatar"])
      .getOne();
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Incident>,
    query: IncidentQueryDto,
  ): SelectQueryBuilder<Incident> {
    const { appId } = query;

    builder
      .where("incident.application_id = :appId", { appId })
      .leftJoin("incident.assigned", "assigned")
      .loadRelationCountAndMap("incident.commentsCount", "incident.comments")
      .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.gravatar"]);

    this.commonQuery(builder, query);

    return builder;
  }

  public get builderAlias(): string {
    return "incident";
  }

  public selectedColumns(): string[] {
    return [
      "id",
      "status",
      "type",
      "message",
      "lastError",
      "errorsCount",
      "errorsDetails",
    ];
  }

  public commonQuery(
    builder: SelectQueryBuilder<Incident>,
    query: IncidentQueryDto,
  ) {
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
            .orWhere("LOWER(incident.type) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(incident.status) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
            .orWhere("LOWER(assigned.name) LIKE LOWER(:search)", {
              search: `%${search}%`
            })
        }),
      );
    }

    if (size) {
      builder.limit(size);
    }
  }
}
