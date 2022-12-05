import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { BaseWorkerService } from "../../../lib/core/worker/base-worker.service";
import { Application } from "../../../lib/db/entities/application.entity";

@Injectable()
export class RuntimeService extends BaseWorkerService<object> {
    constructor(
        private readonly entityManager: EntityManager
    ) {
        super(entityManager)
    }

    public async handle({ id }: Application, data: object): Promise<void> {
        await this.entityManager.getRepository(Application).update({ id }, {
            runtimeConfig: {
                data
            }
        });
        this.logger.log(`Runtime metrics successfully updated for appId: ${id}.`);
    }
}