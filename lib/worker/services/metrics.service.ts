import { Injectable } from "@nestjs/common";
import { InfluxService } from "../../dataSource/influx/influx.service";
import { Application } from "../../db/entities/application.entity";
import { TSDB } from "../../types/tsdb";
import { Metrics } from "../../types/worker";
import { EntityManager } from "typeorm";

@Injectable()
export class MetricsService {
    constructor(
        private entityManager: EntityManager,
        private influxService: InfluxService
    ) { }

    async processMetrics(id: number, data: Metrics) {
        const app = await this.entityManager.getRepository(Application)
            .createQueryBuilder('application')
            .where('application.id = :id', { id })
            .leftJoinAndSelect('application.influxDS', 'influxDS')
            .getOne();

        if (!app.connectedTSDB) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                const { influxDS } = app;
                if (!influxDS) {
                    return;
                }

                const config = { ...influxDS, appId: id };
                await this.influxService.writeData(config, data);
            }
            default:
                break;
        }
    }
}