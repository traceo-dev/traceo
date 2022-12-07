import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { DataSourceConnStatus } from '../../../lib/types/interfaces/tsdb.interface';
import { IMetrics, MetricsQuery, MetricsResponse } from '../../../lib/types/interfaces/metrics.interface';
import { CONNECTION_STATUS, TSDB } from '../../../lib/types/enums/tsdb.enum';
import { InfluxConfigurationDto } from '../../../lib/types/dto/influx.dto';
import { IInfluxDs, InfluxConfiguration } from '../../../lib/types/interfaces/influxds.interface';
import { ApiResponse } from '../../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../../lib/helpers/constants';
import { Application } from '../../../lib/db/entities/application.entity';

@Injectable()
export class InfluxService {
    private logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(InfluxService.name);
    }

    async saveInfluxDataSource(config: InfluxConfigurationDto): Promise<ApiResponse<DataSourceConnStatus>> {
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

    async writeData(config: Partial<InfluxConfiguration>, data: IMetrics): Promise<void> {
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
        // TODO: probably there is a better way to store multiple values allocated to single time...
        const point = new Point(`metrics_${appId}`)
            .floatField('cpuUsage', cpuUsage)
            .floatField('memoryUsage', memory.percentage)
            .floatField('rss', heap.rss)
            .floatField('heapUsed', heap.used)
            .floatField('heapTotal', heap.total)
            .intField('loadAvg', loadAvg)
            .intField('heapNativeContexts', heap.nativeContexts)
            .intField('heapDetachedContexts', heap.detachedContexts)
            .intField('loopMin', eventLoopLag.min)
            .intField('loopMax', eventLoopLag.max)
            .intField('loopMean', eventLoopLag.mean)
            .floatField('gcTotalTime', gc.duration?.total || 0)
            .floatField('gcAvgTime', gc.duration?.average || 0);

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

    async queryData(config: IInfluxDs, dtoQuery: MetricsQuery): Promise<MetricsResponse[]> {
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
                    r._field == "cpuUsage" or 
                    r._field == "memoryUsage" or
                    r._field == "loadAvg" or
                    r._field == "heapUsed" or
                    r._field == "heapTotal" or
                    r._field == "rss" or
                    r._field == "heapNativeContexts" or
                    r._field == "heapDetachedContexts" or
                    r._field == "loopMin" or
                    r._field == "loopMax" or
                    r._field == "loopMean" or
                    r._field == "gcTotalTime" or
                    r._field == "gcAvgTime")
                |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
                |> keep(columns: [
                        "_time", 
                        "cpuUsage", 
                        "memoryUsage", 
                        "loadAvg", 
                        "heapUsed", 
                        "heapTotal", 
                        "rss", 
                        "heapNativeContexts", 
                        "heapDetachedContexts",
                        "loopMin",
                        "loopMax",
                        "loopMean",
                        "gcTotalTime",
                        "gcAvgTime"
                    ])
        `;
        try {
            return await queryApi.collectRows(query);
        } catch (error) {
            this.logger.error(`[${this.queryData.name}] Caused by: ${error}`);
            return [];
        }
    }
}
