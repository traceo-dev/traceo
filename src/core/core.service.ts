import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PageableDto, PageMetaDto, PageOptionsDto } from './core.model';

@Injectable()
export class CoreService {
    constructor() { }

    public async preparePageable<T>(queryBuilder: SelectQueryBuilder<T>, pageOptionsDto: PageOptionsDto): Promise<PageableDto<T>> {
        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

        return new PageableDto(entities, pageMetaDto);
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
