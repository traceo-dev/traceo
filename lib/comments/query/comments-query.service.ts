import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "lib/core/generic.model";
import { GenericQueryService } from "lib/core/generic-query.service";
import { Comment } from "lib/db/entities/comment.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";

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
      .addSelect(["sender.name", "sender.email", "sender.id", "sender.logo"]);

    return builder;
  }
  public getBuilderAlias(): string {
    return "comment";
  }
  public selectedColumns(): string[] {
    return [];
  }
}
