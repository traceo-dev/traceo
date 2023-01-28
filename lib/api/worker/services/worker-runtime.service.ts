import { Injectable } from "@nestjs/common";
import { BaseWorkerService } from "@common/base/worker/base-worker.service";
import { Application } from "@db/entities/application.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class WorkerRuntimeService extends BaseWorkerService<object> {
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