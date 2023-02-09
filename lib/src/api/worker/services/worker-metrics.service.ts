import { Injectable } from "@nestjs/common";
import { ISDKMetrics, TsdbProvider } from "@traceo/types";
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

        if (!app?.tsdbProvider) {
            this.logger.error(`Metrics are sent to appID: ${id} but metrics datasource are not connected!`);
            return;
        }

        switch (app.tsdbProvider) {
            case TsdbProvider.INFLUX2: {
                if (!app?.influxConfig) {
                    return;
                }

                await this.influxService.writeData(id, app.influxConfig, data);
            }
            default:
                break;
        }
    }
}