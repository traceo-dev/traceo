import { Injectable } from "@nestjs/common";
import { Release } from "src/db/entities/release.entity";
import dateUtils from "src/helpers/dateUtils";
import { EntityManager } from "typeorm";
import { ReleaseModel } from "./release.model";

@Injectable()
export class ReleaseService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async updateRelease(update: ReleaseModel, manager: EntityManager = this.entityManager): Promise<void> {
        const { id, ...rest } = update;
        await manager.getRepository(Release).update({ id }, {
            updatedAt: dateUtils.toUnix(),
            ...rest
        });
    }
}