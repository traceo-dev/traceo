import { Injectable, Logger } from "@nestjs/common";
import { DataSourceService } from "../../../api/data-source/dataSource.service";
import { INTERNAL_SERVER_ERROR } from "@common/helpers/constants";
import { MetricQueryDto } from "@common/types/dto/metrics.dto";
import { ApiResponse } from "@common/types/dto/response.dto";
import { TSDB_PROVIDER } from "@common/types/enums/tsdb.enum";
import { IMetric, IMetricSerie, MetricPreviewType, MetricsResponse } from "@common/types/interfaces/metrics.interface";
import { Metric } from "@db/entities/metric.entity";
import { InfluxService } from "../../../providers/influx/influx.service";
import { EntityManager } from "typeorm";

@Injectable()
export class MetricsQueryService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly influxService: InfluxService,
        private readonly dataSourceService: DataSourceService
    ) {
        this.logger = new Logger(MetricsQueryService.name)
    }

    async getMetricData(appId: string, query: MetricQueryDto): Promise<ApiResponse<MetricsResponse[]>> {
        const app = await this.dataSourceService.getDataSourceOrThrowError(appId);
        if (!app) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB_PROVIDER.INFLUX2: {
                const response = await this.influxService.queryData(appId, app.influxDS, query);
                return new ApiResponse("success", undefined, response);
            }
            default:
                return new ApiResponse("error", undefined, []);
        }
    }

    public async getApplicationMetrics(applicationId: string): Promise<ApiResponse<IMetric[]>> {
        try {
            await this.influxService.checkConnection(applicationId);

            const metrics = await this.entityManager.getRepository(Metric).find({
                where: {
                    application: {
                        id: applicationId
                    }
                },
                order: {
                    createdAt: "DESC"
                }
            });

            return new ApiResponse("success", undefined, metrics);
        } catch (err) {
            this.logger.error(`[${this.getApplicationMetrics.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    public async getApplicationMetricPreviewData(
        appId: string, metricId: string, hrCount: number
    ): Promise<ApiResponse<MetricPreviewType>> {
        if (!appId || !metricId) {
            throw new Error('App and metric ids are required!');
        }

        try {
            const metric = await this.entityManager.getRepository(Metric).findOneBy({
                id: metricId, application: {
                    id: appId
                }
            });

            const datasource = await this.getMetricData(appId, {
                fields: this.parseSeries(metric.series),
                hrCount
            });

            return new ApiResponse("success", undefined, {
                options: metric,
                datasource: datasource.data || []
            });
        } catch (err) {
            this.logger.error(`[${this.getApplicationMetricPreviewData.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    private parseSeries(series: IMetricSerie[]): string[] {
        return series?.reduce<string[]>((acc, serie) => {
            acc.push(serie.field);

            return acc;
        }, []) || [];
    }
}