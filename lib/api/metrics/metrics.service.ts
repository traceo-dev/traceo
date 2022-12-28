import { Injectable } from "@nestjs/common";
import dateUtils from "../../common/helpers/dateUtils";
import { Application } from "../../db/entities/application.entity";
import { Metric } from "../../db/entities/metric.entity";
import { EntityManager } from "typeorm";
import * as default_metrics from "./config/default-metrics.json";

@Injectable()
export class MetricsService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    public async addDefaultMetrics(application: Application, entityManager: EntityManager = this.entityManager): Promise<void> {
        if (!default_metrics || !default_metrics.metrics) {
            throw new Error(`Default metrics are required. Check for existing 'default-metrics.json' file.`)
        }

        const promises = default_metrics.metrics.map(async (metric) => {
            const newMetric: Metric = {
                ...metric,
                createdAt: dateUtils.toUnix(),
                application
            };

            await entityManager.getRepository(Metric).save(newMetric);
        });

        await Promise.all(promises);
    }
}