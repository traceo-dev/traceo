import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder
} from 'typeorm';
import { BaseDtoQuery } from './generic.model';
import { GenericEntity } from '../generic.entity';
import { ApiResponse } from '../../../lib/types/dto/response.dto';
import { InternalServerError } from '../../../lib/helpers/errors';

@Injectable()
export abstract class GenericQueryService<
  ENTITY extends GenericEntity,
  QUERY extends BaseDtoQuery,
> {
  public repository: Repository<ENTITY>;

  constructor(manager: EntityManager, repository: EntityTarget<ENTITY>) {
    this.repository = manager.getRepository<ENTITY>(repository);
  }

  public async getApiDto(id: string): Promise<ApiResponse<ENTITY>> {
    try {
      const response = await this.getDto(id);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  public async getApiListDto(query: QUERY): Promise<ApiResponse<ENTITY[]>> {
    try {
      const response = await this.listDto(query);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  public async getDto(id: string): Promise<ENTITY> {
    const where: FindOptionsWhere<ENTITY> = { id } as any;
    return await this.repository.findOneBy(where)
  }

  public async getDtoBy(where: FindOptionsWhere<ENTITY>) {
    return await this.repository.findOneBy(where);
  }

  private createQueryBuilder(query: QUERY): SelectQueryBuilder<ENTITY> {
    const qb = this.repository.createQueryBuilder(this.builderAlias);
    return this.extendQueryBuilder(qb, query);
  }

  public abstract extendQueryBuilder(
    builder: SelectQueryBuilder<ENTITY>,
    query: QUERY,
  ): SelectQueryBuilder<ENTITY>;

  public abstract get builderAlias(): string;

  /**
   * Leave empty array if builder should select all columns from entity
   */
  public abstract selectedColumns(): string[];

  public async listDto(query: QUERY): Promise<ENTITY[]> {
    const { sortBy, order, take, page } = query;

    const queryBuilder: SelectQueryBuilder<ENTITY> =
      this.createQueryBuilder(query);
    this.addSelectToQueryBuilder(queryBuilder, this.selectedColumns());

    if (sortBy && order) {
      queryBuilder.orderBy(
        `${this.builderAlias}.${sortBy}`,
        order || "DESC", "NULLS LAST"
      );
    }

    queryBuilder.limit(take).skip(page > 0 ? (page - 1) * take : 0);

    const { entities } = await queryBuilder.getRawAndEntities();

    return entities;
  }

  private addSelectToQueryBuilder(
    queryBuilder: SelectQueryBuilder<ENTITY>,
    columns: string[],
  ): SelectQueryBuilder<ENTITY> {
    if (columns.length > 0) {
      columns.forEach((column) => {
        queryBuilder.addSelect(
          `${this.builderAlias}.${column}`,
          columns[column],
        );
      });
    }

    return queryBuilder;
  }
}
