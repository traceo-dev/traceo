import { Injectable } from "@nestjs/common";
import { IMetrics } from "../../../common/types/interfaces/metrics.interface";
import { BaseWorkerService } from "../../../common/base/worker/base-worker.service";
import { Application } from "../../../db/entities/application.entity";
import { InfluxService } from "../../../providers/influx/influx.service";
import { EntityManager } from "typeorm";
import { TSDB } from "../../../common/types/enums/tsdb.enum";

@Injectable()
export class MetricsService extends BaseWorkerService<IMetrics> {
    constructor(
        private entityManager: EntityManager,
        private influxService: InfluxService
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: IMetrics): Promise<void> {
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
            case TSDB.INFLUX2: {
                if (!app?.influxDS) {
                    return;
                }

                const config = { ...app.influxDS, appId: id };
                await this.influxService.writeData(config, data);
            }
            default:
                break;
        }
    }
}