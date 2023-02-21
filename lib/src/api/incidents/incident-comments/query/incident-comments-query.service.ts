import { Injectable } from "@nestjs/common";
import { BaseQueryService } from "../../../../common/base/query/base-query.service";
import { BaseDtoQuery } from "../../../../common/base/query/base-query.model";
import { Comment } from "../../../../db/entities/comment.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { GetCommentsDto } from "../../../../common/types/dto/comment.dto";

@Injectable()
export class IncidentCommentsQueryService extends BaseQueryService<Comment, BaseDtoQuery> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Comment);
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Comment>,
    query: GetCommentsDto
  ): SelectQueryBuilder<Comment> {
    const { incidentId } = query;

    builder
      .where("comment.incident = :incidentId", { incidentId })
      .andWhere("comment.removed = false")
      .leftJoin("comment.sender", "sender")
      .addSelect(["sender.name", "sender.email", "sender.id", "sender.gravatar"]);

    return builder;
  }

  public get builderAlias(): string {
    return "comment";
  }

  public selectedColumns(): string[] {
    return [];
  }
}
