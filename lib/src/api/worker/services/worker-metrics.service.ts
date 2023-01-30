import { Injectable } from "@nestjs/common";
import { ISDKMetrics, TSDB_PROVIDER } from "@traceo/types";
import { BaseWorkerService } from "@common/base/worker/base-worker.service";
import { Application } from "@db/entities/application.entity";
import { InfluxService } from "../../../providers/influx/influx.service";
import { EntityManager } from "typeorm";

@Injectable()
export class WorkerMetricsService extends BaseWorkerService<ISDKMetrics> {
    constructor(
        private entityManager: EntityManager,
        private influxService: InfluxService
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: ISDKMetrics): Promise<void> {
        const { id } = application;

        const app = await this.entityManager.getRepository(Application).findOneBy({ id });
        if (!app) {
            this.logger.error(`Bad appId. Application for metrics not found!`);
            return;
        }

        if (!app?.connectedTSDB) {
            this.logger.error(`Metrics are sent to appID: ${id} but metrics datasource are not connected!`);
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB_PROVIDER.INFLUX2: {
                if (!app?.influxDS) {
                    return;
                }

                await this.influxService.writeData(id, app.influxDS, data);
            }
            default:
                break;
        }
    }
}