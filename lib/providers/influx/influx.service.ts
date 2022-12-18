import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { Application } from '../../db/entities/application.entity';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import { InfluxConfigurationDto } from '../../common/types/dto/influx.dto';
import { InfluxConfiguration, IInfluxDs } from '../../common/types/interfaces/influxds.interface';
import { IMetrics, MetricNameEnum, MetricsQuery, metricFields, MetricsResponse } from '../../common/types/interfaces/metrics.interface';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { CONNECTION_STATUS, TSDB } from '../../common/types/enums/tsdb.enum';
import { DataSourceConnStatus } from '../../common/types/interfaces/tsdb.interface';

@Injectable()
export class InfluxService {
    private logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(InfluxService.name);
    }

    public async saveInfluxDataSource(config: InfluxConfigurationDto): Promise<ApiResponse<DataSourceConnStatus>> {
        const { appId } = config;

        return this.entityManager.transaction(async (manager) => {
            const { status, error } = await this.influxConnectionTest({ ...config });
            await manager.getRepository(Application).update({ id: appId }, {
                influxDS: {
                    ...config,
                    connError: error,
                    connStatus: status
                },
                connectedTSDB: TSDB.INFLUX2
            });
            this.logger.log(`InfluxDB data source updated in app: ${appId}`);

            return new ApiResponse("success", "InfluxDB data source updated", {
                status, error
            });
        }).catch((err: Error) => {
            this.logger.error(`[${this.saveInfluxDataSource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }

    public async writeData(config: Partial<InfluxConfiguration>, data: IMetrics): Promise<void> {
        const { appId, connStatus, ...rest } = config;
        const { bucket, org, token, url } = rest;
        const { cpuUsage, memory, loadAvg, heap, eventLoopLag, gc } = data;

        if (!url || !token) {
            this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
            return;
        }

        const appRef = this.entityManager.getRepository(Application);

        const influxDb = new InfluxDB({ url, token });
        const write = influxDb.getWriteApi(org, bucket);

        const point = new Point(`metrics_${appId}`)
            .floatField(MetricNameEnum.CPU_USAGE, cpuUsage)
            .floatField(MetricNameEnum.MEMORY_USAGE, memory.percentage)
            .floatField(MetricNameEnum.RSS, heap.rss)
            .floatField(MetricNameEnum.HEAP_USED, heap.used)
            .floatField(MetricNameEnum.HEAP_TOTAL, heap.total)
            .intField(MetricNameEnum.LOAD_AVG, loadAvg)
            .intField(MetricNameEnum.HEAP_NATIVE_CONTEXTS, heap.nativeContexts)
            .intField(MetricNameEnum.HEAP_DETACHED_CONTEXTS, heap.detachedContexts)
            .intField(MetricNameEnum.LOOP_MIN, eventLoopLag.min)
            .intField(MetricNameEnum.LOOP_MAX, eventLoopLag.max)
            .intField(MetricNameEnum.LOOP_MEAN, eventLoopLag.mean)
            .floatField(MetricNameEnum.GC_TOTAL_TIME, gc.duration?.total || 0)
            .floatField(MetricNameEnum.GC_AVG_TIME, gc.duration?.average || 0);

        write.writePoint(point);
        write
            .close()
            .then(async () => {
                this.logger.log(`New metrics write to InfluxDB for appId: ${appId}`);

                if (connStatus === CONNECTION_STATUS.FAILED) {
                    const influxDS = { ...rest, connStatus: CONNECTION_STATUS.CONNECTED, connError: null };
                    await appRef.update({ id: appId }, { influxDS });
                }
            })
            .catch(async (error) => {
                this.logger.error(`Cannot write new metrics to InfluxDB for appId: ${appId}. Caused by: ${error}`);

                if (connStatus === CONNECTION_STATUS.CONNECTED) {
                    const influxDS = { ...rest, connStatus: CONNECTION_STATUS.FAILED, connError: String(error["code"]) };
                    await appRef.update({ id: appId }, { influxDS });
                }
            });
    }

    async influxConnectionTest(config: Partial<InfluxConfigurationDto>): Promise<{ status: CONNECTION_STATUS; error?: string; }> {
        const { url, token, org, bucket } = config;
        const influxDb = new InfluxDB({ url, token });

        const write = influxDb.getWriteApi(org, bucket);
        const point = new Point('traceo_conn_test').floatField('test', 0);
        write.writePoint(point)
        return write
            .close()
            .then(async () => {
                return {
                    status: CONNECTION_STATUS.CONNECTED
                }
            })
            .catch(async (error) => {
                return {
                    status: CONNECTION_STATUS.FAILED,
                    error: `${error["errno"]} : ${error["code"]}`
                }
            });
    }

    public async queryData(config: IInfluxDs, dtoQuery: MetricsQuery): Promise<MetricsResponse[]> {
        const { url, token, org, bucket } = config;
        const { hrCount, id } = dtoQuery;

        if (!url || !token) {
            this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
            return;
        }

        const influxDb = new InfluxDB({ url, token });
        const queryApi = influxDb.getQueryApi(org)

        const query = `
            from(bucket: "${bucket}") 
                |> range(start: -${hrCount}h)
                |> filter(fn: (r) => r._measurement == "metrics_${id}")
                |> filter(fn: (r) => 
                    ${this.filterQuery}
                |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
                |> keep(columns: [
                        "_time", 
                    ${this.columnQuery}
                    ])
        `;
        try {
            return await queryApi.collectRows(query);
        } catch (error) {
            this.logger.error(`[${this.queryData.name}] Caused by: ${error}`);
            return [];
        }
    }

    private get filterQuery(): string {
        const mapSize = metricFields.size;
        let index = 0, filterQuery = "";

        for (const [key, _] of metricFields.entries()) {
            index++;
            const isLastField = index === mapSize;
            filterQuery += isLastField ? `r._field == "${key}")` : `r._field == "${key}" or \n`;
        }

        return filterQuery;
    }

    private get columnQuery(): string {
        const mapSize = metricFields.size;
        let index = 0, columnQuery = "";

        for (const [key, _] of metricFields.entries()) {
            index++;
            const isLastIndex = index === mapSize;
            columnQuery += isLastIndex ? `"${key}"\n` : `"${key}",\n`;
        }

        return columnQuery;
    }
}
