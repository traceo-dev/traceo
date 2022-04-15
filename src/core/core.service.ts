import { Injectable } from '@nestjs/common';
import { mongoDbUtils } from 'src/helpers/mongodb';
import { SelectQueryBuilder } from 'typeorm';
import { PageableDto, PageMetaDto, PageOptionsDto } from './core.model';

@Injectable()
export class CoreService {
  constructor() { }

  public async preparePageable<T>(queryBuilder: SelectQueryBuilder<T>, pageOptionsDto: PageOptionsDto): Promise<PageableDto<T>> {
    const count = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, count });

    return new PageableDto(entities, pageMetaDto);
  }

  public async preparePageableMongo<T>(query: any, pageOptionsDto: PageOptionsDto): Promise<PageableDto<T>> {
    const documents = mongoDbUtils.getDocuments<T>(query);
    const count = documents.length;

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, count });

    return new PageableDto(documents, pageMetaDto);
  }

  async addSelectToQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    tableName: string,
    columns: { [key: string]: string },
  ): Promise<SelectQueryBuilder<T>> {
    Object.keys(columns).forEach((col) => {
      queryBuilder.addSelect(`${tableName}.${col}`, columns[col]);
    });

    return queryBuilder;
  }
}
