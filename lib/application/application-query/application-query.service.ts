import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'lib/core/generic.model';
import { GenericQueryService } from 'lib/core/generic-query.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Application } from 'lib/db/entities/application.entity';
import { Runtime } from 'lib/db/entities/runtime.entity';
import { Log } from 'lib/db/entities/log.entity';
import { ApplicationLogsQuery } from '../application.model';

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
    return ["id", "name", "gravatar", "lastIncidentAt", "connectedTSDB"];
  }

  public async getApplicationRuntime(appId: number) {
    const config = await this.entityManager.getRepository(Runtime).findOneBy({ application: { id: appId }});
    return config?.data || {};
  }

  public async getApplicationLogs(query: ApplicationLogsQuery) {
    const { startDate, endDate, id } = query;

    if (!id) {
      return [];
    }

    return await this.entityManager.getRepository(Log).createQueryBuilder('log')
      .where('log.applicationId = :id', { id })
      .andWhere('log.receiveTimestamp > :startDate', { startDate })
      .andWhere('log.receiveTimestamp < :endDate', { endDate })
      .orderBy('log.receiveTimestamp', 'DESC')
      .select(['log.timestamp', 'log.message', 'log.level', 'log.resources', 'log.receiveTimestamp'])
      .take(1000)
      .getMany();
  }
}
