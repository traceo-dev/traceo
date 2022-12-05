import { Injectable } from "@nestjs/common";
import { InfluxService } from "../../dataSource/influx/influx.service";
import { Application } from "../../db/entities/application.entity";
import { EntityManager } from "typeorm";
import { BaseWorkerService } from "../../../lib/core/worker/base-worker.service";
import { IMetrics } from "../../../lib/types/interfaces/metrics.interface";
import { TSDB } from "../../../lib/types/enums/tsdb.enum";

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

        const app = await this.entityManager.getRepository(Application)
            .createQueryBuilder('application')
            .where('application.id = :id', { id })
            .getOne();

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