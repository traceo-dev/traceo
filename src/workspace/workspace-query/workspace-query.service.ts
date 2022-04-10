import { Injectable } from '@nestjs/common';
import { Workspace } from 'src/db/entities/workspace.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class WorkspaceQueryService {
    constructor(
        private readonly entityManager: EntityManager,
    ) { }

    public async getWorkspaceById(id: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return manager.getRepository(Workspace).findOneBy({ _id: id });
    }
}
