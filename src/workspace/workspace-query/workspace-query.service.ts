import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/db/entities/workspace.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class WorkspaceQueryService {
    constructor(
        private readonly entityManager: EntityManager,
    ) { }

    public async getWorkspaceById(id: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return manager
            .getRepository(Workspace)
            .createQueryBuilder('workspace')
            .where('workspace._id = :workspaceId', { workspaceId: id })
            .leftJoin('workspace.owner', 'owner')
            .addSelect(['owner.name', 'owner.logo'])
            .getOne()
    }

    public async getWorkspaceByName(name: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return manager.getRepository(Workspace).findOneBy({ name });
    }
}
