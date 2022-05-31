import { Injectable } from "@nestjs/common";
import { Release, RELEASE_STATUS } from "src/db/entities/release.entity";
import dateUtils from "src/helpers/dateUtils";
import { EntityManager } from "typeorm";
import { CreateReleaseModal, ReleaseModel } from "./release.model";

@Injectable()
export class ReleaseService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async createRelease(body: CreateReleaseModal, manager: EntityManager = this.entityManager): Promise<void> {
        const { workspaceId, ...rest } = body;
        await manager.getRepository(Release).save({
            status: RELEASE_STATUS.INACTIVE,
            createdAt: dateUtils.toUnix(),
            env: "dev",
            incidentsCount: 0,
            incidentsOccurCount: 0,
            workspace: {
                id: workspaceId
            },
            deployments: [],
            ...rest
        })
    }

    async updateRelease(update: ReleaseModel, manager: EntityManager = this.entityManager): Promise<void> {
        const { id, ...rest } = update;
        await manager.getRepository(Release).update({ id }, {
            updatedAt: dateUtils.toUnix(),
            ...rest
        });
    }

    async removeRelease(id: string, manager: EntityManager = this.entityManager): Promise<void> {
        await manager.getRepository(Release)
            .createQueryBuilder('release')
            .where('release.id = :id', { id })
            .delete()
            .execute();
    }
}