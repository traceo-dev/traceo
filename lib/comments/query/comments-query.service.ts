import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "../../core/query/generic.model";
import { Comment } from "../../db/entities/comment.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { GenericQueryService } from "../../core/query/generic-query.service";

@Injectable()
export class CommentsQueryService extends GenericQueryService<
  Comment,
  BaseDtoQuery
> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Comment);
  }

  public extendQueryBuilder(
    builder: SelectQueryBuilder<Comment>,
    query: BaseDtoQuery,
  ): SelectQueryBuilder<Comment> {
    const { incidentId } = query;

    builder
      .where("comment.incident = :incidentId", { incidentId })
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
