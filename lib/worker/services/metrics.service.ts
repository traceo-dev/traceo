import { Injectable } from "@nestjs/common";
import { InfluxService } from "../../dataSource/influx/influx.service";
import { Application } from "../../db/entities/application.entity";
import { TSDB } from "../../types/tsdb";
import { Metrics } from "../../types/worker";
import { EntityManager } from "typeorm";
import { BaseWorkerService } from "lib/core/worker/base-worker.service";

@Injectable()
export class MetricsService extends BaseWorkerService<Metrics> {
    constructor(
        private entityManager: EntityManager,
        private influxService: InfluxService
    ) {
        super(entityManager);
    }

    public async handle(application: Application, data: Metrics): Promise<void> {
        const { id } = application;

        const app = await this.entityManager.getRepository(Application)
            .createQueryBuilder('application')
            .where('application.id = :id', { id })
            .leftJoinAndSelect('application.influxDS', 'influxDS')
            .getOne();

        if (!app?.connectedTSDB) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                const { influxDS } = app;
                if (!influxDS) {
                    return;
                }

                const config = { ...influxDS, appId: id };
                this.logger.log(`New metrics write to InfluxDB for appId: ${id}`);
                await this.influxService.writeData(config, data);
            }
            default:
                break;
        }
    }
}