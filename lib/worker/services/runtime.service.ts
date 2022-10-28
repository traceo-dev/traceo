import { Injectable, Logger } from "@nestjs/common";
import { Runtime } from "../../db/entities/runtime.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class RuntimeService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    public async processRuntimeMetrics(appId: number, data: object) {
        if (!appId) {
            throw new Error('appId is requried!');
        }

        try {
            const runtime = await this.entityManager.getRepository(Runtime).findOne({ where: { application: { id: appId } } });
            if (!runtime) {
                await this.entityManager.getRepository(Runtime).save(
                    {
                        application: {
                            id: appId
                        },
                        data
                    }
                );
                Logger.log(
                    `[saveRuntimeMetrics] Runtime metrics successfully saved for appId: ${appId}.`
                );
                return;
            }

            await this.entityManager.getRepository(Runtime).update({ id: runtime.id }, { data });
            Logger.log(
                `[saveRuntimeMetrics] Runtime metrics successfully updated for appId: ${appId}.`
            );
        } catch (error) {
            Logger.log(
                `[saveRuntimeMetrics] Error during update runtime metrics. Caused by: ${error}`
            );
            throw new Error(error);
        }
    }
}