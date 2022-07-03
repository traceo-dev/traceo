import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { GenericQueryService } from 'src/core/generic-query.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Application } from 'src/db/entities/application.entity';

@Injectable()
export class ApplicationQueryService extends GenericQueryService<Application, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Application);
    }

    public async getApplication(id: number): Promise<Application | null> {
        return await this.getDto(id);
    }

    public override async getDto(id: number): Promise<Application | null> {
        return await
            this.repository
                .createQueryBuilder('application')
                .where('application.id = :id', { id })
                .leftJoin('application.owner', 'owner')
                .addSelect(['owner.name', 'owner.logo'])
                .getOne();
    }

    public async getApplicationByName(name: string): Promise<Application | null> {
        return this.repository.findOneBy({ name });
    }

    public getBuilderAlias(): string {
        return 'application';
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Application>, query: BaseDtoQuery): SelectQueryBuilder<Application> {
        throw new Error('Method not implemented.');
    }

    public selectedColumns(): string[] {
        throw new Error('Method not implemented.');
    }
}
