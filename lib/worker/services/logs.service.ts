import { Injectable } from "@nestjs/common";
import { Log } from "../../db/entities/log.entity";
import { TraceoLog } from "../../types/worker";
import { EntityManager } from "typeorm";
import { BaseWorkerService } from "../../../lib/core/worker/base-worker.service";
import { Application } from "../../../lib/db/entities/application.entity";

@Injectable()
export class LogsService extends BaseWorkerService<TraceoLog> {
    constructor(
        private readonly entityManager: EntityManager
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: TraceoLog): Promise<void> {
        const { id } = application;
        const { timestamp, level, message, resources, unix } = data;

        await this.entityManager.getRepository(Log).save({
            application: {
                id
            },
            timestamp,
            level,
            message,
            receiveTimestamp: unix,
            resources: {
                appId: id,
                ...resources
            }
        });
        this.logger.log(`New log saved for application: ${application.id}.`);
    };
}