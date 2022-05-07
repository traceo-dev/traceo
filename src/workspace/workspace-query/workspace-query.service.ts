import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/db/entities/workspace.entity';
import { WorkspaceResponse } from 'src/db/models/workspace';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class WorkspaceQueryService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly releaseQueryService: ReleaseQueryService
    ) { }

    public async getWorkspace(id: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        const workspace = await this.getWorkspaceById(id, manager);
        return workspace;
    }

    public async getWorkspaceById(id: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return await manager
            .getRepository(Workspace)
            .createQueryBuilder('workspace')
            .where('workspace.id = :id', { id })
            .leftJoin('workspace.owner', 'owner')
            .addSelect(['owner.name', 'owner.logo'])
            .getOne();
    }

    public async getWorkspaceByName(name: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return manager.getRepository(Workspace).findOneBy({ name });
    }
}
