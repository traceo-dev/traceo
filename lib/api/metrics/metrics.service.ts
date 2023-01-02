import { Injectable, Logger } from "@nestjs/common";
import dateUtils from "../../common/helpers/dateUtils";
import { Application } from "../../db/entities/application.entity";
import { Metric } from "../../db/entities/metric.entity";
import { EntityManager } from "typeorm";
import * as default_metrics from "./config/default-metrics.json";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../common/helpers/constants";
import { UpdateMetricDto } from "../../common/types/dto/metrics.dto";

@Injectable()
export class MetricsService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(MetricsService.name);
    }

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

    public async updateMetric(
        metricId: string,
        dto: UpdateMetricDto,
        manager: EntityManager = this.entityManager
    ): Promise<ApiResponse<string>> {
        try {
            await manager.getRepository(Metric).update({ id: metricId }, dto);
            return new ApiResponse("success", "Metric updated", undefined);
        } catch (error) {
            this.logger.error(`[${this.updateMetric.name}] Caused by: ${error}`)
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
        }
    }
}