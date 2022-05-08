import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseDtoQuery } from './generic.model';
import { GenericEntity } from './generic.entity';

@Injectable()
export abstract class GenericQueryService<ENTITY extends GenericEntity, QUERY extends BaseDtoQuery> {

  public repository: Repository<ENTITY>;

  constructor(
    manager: EntityManager,
    repository: EntityTarget<ENTITY>
  ) {
    this.repository = manager.getRepository<ENTITY>(repository);
  }

  public async getDto(id: string): Promise<ENTITY> {
    return await this.repository.findOneByOrFail({ id } as any);
  }

  private createQueryBuilder(query: QUERY): SelectQueryBuilder<ENTITY> {
    const qb = this.repository.createQueryBuilder(this.getBuilderAlias());
    return this.extendQueryBuilder(qb, query);
  }

  public abstract extendQueryBuilder(builder: SelectQueryBuilder<ENTITY>, query: QUERY): SelectQueryBuilder<ENTITY>;

  public abstract getBuilderAlias(): string;

  public abstract selectedColumns(): string[];

  public async listDto(query: QUERY): Promise<ENTITY[]> {
    const { sortBy, order, take, page } = query;

    const queryBuilder: SelectQueryBuilder<ENTITY> = this.createQueryBuilder(query);
    this.addSelectToQueryBuilder(queryBuilder, this.selectedColumns());

    queryBuilder
      .orderBy(`${this.getBuilderAlias()}.${sortBy}`, order)
      .limit(take)
      .skip(page > 0 ? (page - 1) * take : 0);

    const { entities } = await queryBuilder.getRawAndEntities();

    return entities;
  }

  private addSelectToQueryBuilder(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    columns: string[],
  ): SelectQueryBuilder<ENTITY> {
    if (columns.length > 0) {
      columns.forEach((column) => {
        queryBuilder.addSelect(`${this.getBuilderAlias()}.${column}`, columns[column]);
      });
    }

    return queryBuilder;
  }
}
