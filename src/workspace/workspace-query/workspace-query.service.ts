import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { GenericQueryService } from 'src/core/generic-query.service';
import { Workspace } from 'src/db/entities/workspace.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class WorkspaceQueryService extends GenericQueryService<Workspace, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Workspace);
    }

    public async getWorkspace(id: string): Promise<Workspace | null> {
        return await this.getDto(id);
    }

    public override async getDto(id: string): Promise<Workspace | null> {
        return await
            this.repository
                .createQueryBuilder('workspace')
                .where('workspace.id = :id', { id })
                .leftJoin('workspace.owner', 'owner')
                .addSelect(['owner.name', 'owner.logo'])
                .getOne();
    }

    public async getWorkspaceByName(name: string): Promise<Workspace | null> {
        return this.repository.findOneBy({ name });
    }

    public getBuilderAlias(): string {
        return 'workspace';
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Workspace>, query: BaseDtoQuery): SelectQueryBuilder<Workspace> {
        throw new Error('Method not implemented.');
    }

    public selectedColumns(): string[] {
        throw new Error('Method not implemented.');
    }
}
