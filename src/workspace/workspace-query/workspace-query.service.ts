import { Inject, Injectable } from '@nestjs/common';
import { Release } from 'src/db/documents/release';
import { Workspace } from 'src/db/entities/workspace.entity';
import { WorkspaceResponse } from 'src/db/models/workspace';
import { COLLECTION, MONGODB_CONNECTION } from 'src/db/mongodb.module';
import { mongoDbUtils } from 'src/helpers/mongodb';
import { Db, EntityManager } from 'typeorm';

@Injectable()
export class WorkspaceQueryService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private db: Db,
        private readonly entityManager: EntityManager,
    ) { }

    public async getWorkspace(id: string, manager: EntityManager = this.entityManager): Promise<WorkspaceResponse | null> {
        const releaseInfoQuery = await this.db.collection(COLLECTION.RELEASES).find({
            appId: id,
            env: 'dev' //change to property getting from request
        }).sort({ createdAt: -1 }).limit(1).toArray();
        const releaseInfo = mongoDbUtils.getDocuments<Release>(releaseInfoQuery);
        const workspace = await this.getWorkspaceById(id, manager);

        return {
            version: releaseInfo[0]?.version || " ",
            ...workspace
        }
    }

    public async getWorkspaceById(id: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return await manager
            .getRepository(Workspace)
            .createQueryBuilder('workspace')
            .where('workspace._id = :workspaceId', { workspaceId: id })
            .leftJoin('workspace.owner', 'owner')
            .addSelect(['owner.name', 'owner.logo'])
            .getOne();
    }

    public async getWorkspaceByName(name: string, manager: EntityManager = this.entityManager): Promise<Workspace | null> {
        return manager.getRepository(Workspace).findOneBy({ name });
    }
}
