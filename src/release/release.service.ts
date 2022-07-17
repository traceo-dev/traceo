import { Injectable } from "@nestjs/common";
import { Release, RELEASE_STATUS } from "src/db/entities/release.entity";
import { Environment } from "src/db/models/release";
import dateUtils from "src/helpers/dateUtils";
import { EntityManager } from "typeorm";
import { CreateReleaseModal, ReleaseModel } from "./release.model";

@Injectable()
export class ReleaseService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async createRelease(body: CreateReleaseModal, env: Environment): Promise<void> {
        const { applicationId, ...rest } = body;
        await this.entityManager.getRepository(Release).save({
            status: RELEASE_STATUS.INACTIVE,
            createdAt: dateUtils.toUnix(),
            env,
            incidentsCount: 0,
            incidentsOccurCount: 0,
            application: {
                id: applicationId
            },
            deployments: [],
            ...rest
        })
    }

    async updateRelease(update: ReleaseModel): Promise<void> {
        const { id, ...rest } = update;
        await this.entityManager.getRepository(Release).update({ id }, {
            updatedAt: dateUtils.toUnix(),
            ...rest
        });
    }

    async removeRelease(id: string): Promise<void> {
        await this.entityManager.getRepository(Release)
            .createQueryBuilder('release')
            .where('release.id = :id', { id })
            .delete()
            .execute();
    }
}