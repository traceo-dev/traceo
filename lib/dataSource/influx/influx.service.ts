import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDS } from '../../db/entities/influxds.entity';
import { Application } from '../../db/entities/application.entity';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { DataSourceConnStatus } from '../../../lib/types/interfaces/tsdb.interface';
import { IMetrics, MetricsQuery, MetricsResponse } from '../../../lib/types/interfaces/metrics.interface';
import { CONNECTION_STATUS, TSDB } from '../../../lib/types/enums/tsdb.enum';
import { InfluxConfigurationDto } from '../../../lib/types/dto/influx.dto';
import { InfluxConfiguration } from '../../../lib/types/interfaces/influxds.interface';

@Injectable()
export class InfluxService {
    private logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(InfluxService.name);
    }

    async saveInfluxDataSource(config: InfluxConfigurationDto): Promise<DataSourceConnStatus> {
        const { appId, token, ...rest } = config;

        return await this.entityManager.transaction(async (manager) => {
            const influxRef = manager.getRepository(InfluxDS);
            const ds = await influxRef.findOneBy({
                application: {
                    id: appId
                }
            });

            const dataSource = {
                ...rest,
                application: {
                    id: appId
                },
                token
            }

            const { status, error } = await this.influxConnectionTest({ ...dataSource });
            const dsPayload = {
                ...dataSource,
                connError: error,
                connStatus: status
            }
            if (!ds) {
                const influx = await influxRef.save(dsPayload);
                await manager.getRepository(Application).update({ id: appId }, {
                    connectedTSDB: TSDB.INFLUX2,
                    influxDS: influx
                })

                this.logger.log(`InfluxDB data source attached to app: ${appId}`);
                return {
                    status, error
                };
            }

            await influxRef.update({ id: ds.id }, dsPayload);
            this.logger.log(`InfluxDB data source updated in app: ${appId}`);

            return {
                status, error
            };
        });
    }

    async writeData(config: Partial<InfluxConfiguration>, data: IMetrics): Promise<void> {
        const { url, token, bucket, org, connStatus, appId } = config;
        const { cpuUsage, memory, loadAvg, heap, eventLoopLag, gc } = data;

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

        const influxRef = this.entityManager.getRepository(InfluxDS);

        write.writePoint(point);
        write
            .close()
            .then(async () => {
                if (connStatus === CONNECTION_STATUS.FAILED) {
                    await influxRef.update({ application: { id: appId } }, {
                        connStatus: CONNECTION_STATUS.CONNECTED,
                        connError: null
                    });
                }
            })
            .catch(async (error) => {
                if (connStatus === CONNECTION_STATUS.CONNECTED) {
                    await influxRef.update({ application: { id: appId } }, {
                        connStatus: CONNECTION_STATUS.FAILED,
                        connError: error
                    });
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

    async queryData(config: InfluxConfigurationDto, dtoQuery: MetricsQuery): Promise<MetricsResponse[]> {
        const { url, token, org, bucket } = config;
        const { hrCount, id } = dtoQuery;

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
            this.logger.error(error);
            return [];
        }
    }
}
