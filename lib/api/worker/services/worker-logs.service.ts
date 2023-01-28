import { Injectable } from "@nestjs/common";
import { TraceoLog } from "@common/types/interfaces/log.interface";
import { BaseWorkerService } from "@common/base/worker/base-worker.service";
import { Application } from "@db/entities/application.entity";
import { Log } from "@db/entities/log.entity";
import { EntityManager } from "typeorm";


@Injectable()
export class WorkerLogsService extends BaseWorkerService<TraceoLog> {
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