import { Injectable, Logger } from '@nestjs/common';
import { BaseDtoQuery } from 'lib/core/generic.model';
import { GenericQueryService } from 'lib/core/generic-query.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Application } from 'lib/db/entities/application.entity';
import { RequestUser } from 'lib/auth/auth.model';
import { AccountMemberRelationship } from 'lib/db/entities/account-member-relationship.entity';
import { ApplicationResponse } from 'lib/types/application';

@Injectable()
export class ApplicationQueryService extends GenericQueryService<
  Application,
  BaseDtoQuery
> {
  constructor(readonly entityManager: EntityManager) {
    super(entityManager, Application);
  }

  public getBuilderAlias(): string {
    return 'application';
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
      .loadRelationCountAndMap(
        "application.incidentsCount",
        "application.incidents",
      )
      .addSelect('owner.name', 'owner.email');

    return builder;
  }

  public selectedColumns(): string[] {
    return ["id", "name", "gravatar", "lastIncidentAt", "defaultEnv"];
  }
}
