import { Injectable, Logger } from "@nestjs/common";
import { Log } from "../../db/entities/log.entity";
import { TraceoLog } from "../../types/worker";
import { EntityManager } from "typeorm";
import { ApplicationQueryService } from "../../../lib/application/application-query/application-query.service";

@Injectable()
export class LogsService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly appService: ApplicationQueryService
    ) { }

    public async processLog(id: number, log: TraceoLog) {
        if (!id) {
            throw new Error('appId is required!');
        }

        await this.appService.checkAppExists(id);

        const { timestamp, level, message, resources, unix } = log;
        try {
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

            Logger.log(`[saveLog] Log successfully save for appId: ${id}`);
            return;
        } catch (error) {
            Logger.log(
                `[saveLog] Error during saving log for appId: ${id}. Caused by: ${error}`
            );
            throw new Error(error);
        }
    }
}