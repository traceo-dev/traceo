import { Injectable } from "@nestjs/common";
import { Runtime } from "../../db/entities/runtime.entity";
import { EntityManager } from "typeorm";
import { BaseWorkerService } from "lib/core/worker/base-worker.service";
import { Application } from "lib/db/entities/application.entity";

@Injectable()
export class RuntimeService extends BaseWorkerService<object> {
    constructor(
        private readonly entityManager: EntityManager
    ) {
        super(entityManager)
    }

    public async handle(application: Application, data: object): Promise<void> {
        const { id } = application;

        const runtime = await this.entityManager.getRepository(Runtime).findOne({ where: { application: { id } } });
        if (!runtime) {
            await this.entityManager.getRepository(Runtime).save(
                {
                    application: { id },
                    data
                }
            );
            this.logger.log(`Runtime metrics successfully saved for appId: ${id}.`);
            return;
        }

        await this.entityManager.getRepository(Runtime).update({ id: runtime.id }, { data });
        this.logger.log(`Runtime metrics successfully updated for appId: ${id}.`);
    }
}