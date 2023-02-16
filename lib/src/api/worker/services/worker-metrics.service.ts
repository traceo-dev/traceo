import { Injectable } from "@nestjs/common";
import { DatasourceProvider, ISDKMetrics } from "@traceo/types";
import { BaseWorkerService } from "../../../common/base/worker/base-worker.service";
import { Application } from "../../../db/entities/application.entity";
import { InfluxService } from "../../../providers/influx/influx.service";
import { EntityManager } from "typeorm";
import { BaseProviderService } from "../../../common/base/provider/base-provider.service";
import { Datasource } from "../../../db/entities/datasource.entity";

@Injectable()
export class WorkerMetricsService extends BaseWorkerService<ISDKMetrics> {
    constructor(
        private entityManager: EntityManager
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: ISDKMetrics): Promise<void> {
        const { tsdbDatasource } = application;

        if (!tsdbDatasource) {
            this.logger.error(`[${this.handle.name}] Cannot handle incoming metrics. Not connected datasource.`);
            return;
        }

        await this.entityManager.transaction(async (manager) => {
            const ds = await manager.getRepository(Datasource).findOneBy({
                appId: application.id
            });

            if (!ds) {
                this.logger.error(`Datasource for metrics not found!`);
                return;
            }

            const services = new Map<DatasourceProvider, BaseProviderService>([
                [DatasourceProvider.INLFUX_DB, new InfluxService(this.entityManager)],
            ]);
            const service = services.get(ds.type);
            await service.writeData(ds, data);
        })
    }
}