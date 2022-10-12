import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxConfiguration, InfluxConfigurationBody } from './influx.model';
import { InfluxDS } from 'lib/db/entities/influxds.entity';
import { Application } from 'lib/db/entities/application.entity';
import { CONNECTION_STATUS, DataSourceConnStatus, MetricsQueryDto, MetricsResponse, TSDB } from 'lib/types/tsdb';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { Metrics } from 'lib/types/worker';
import { logger } from 'traceo';


@Injectable()
export class InfluxService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async saveInfluxDataSource(config: InfluxConfigurationBody): Promise<DataSourceConnStatus> {
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

                Logger.log(`InfluxDB data source attached to app: ${appId}`);
                return {
                    status, error
                };
            }

            await influxRef.update({ id: ds.id }, dsPayload);
            Logger.log(`InfluxDB data source updated in app: ${appId}`);

            return {
                status, error
            };
        });
    }

    async writeData(config: Partial<InfluxConfiguration>, data: Metrics): Promise<void> {
        const { url, token, bucket, org, connStatus, appId } = config;
        const { cpuUsage } = data;

        const influxDb = new InfluxDB({ url, token });

        const write = influxDb.getWriteApi(org, bucket);
        const point = new Point(`metrics_${appId}`)
            .floatField('cpuUsage', cpuUsage);

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

    async influxConnectionTest(config: Partial<InfluxConfigurationBody>): Promise<{ status: CONNECTION_STATUS; error?: string; }> {
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

    async queryData(config: InfluxConfigurationBody, dtoQuery: MetricsQueryDto): Promise<MetricsResponse[]> {
        const { url, token, org, bucket } = config;
        const { hrCount, id } = dtoQuery;

        const influxDb = new InfluxDB({ url, token });

        const queryApi = influxDb.getQueryApi(org)

        /**
         * To return value in this same table add in filter something like "or r._field == "otherMetric""
         */

        const query = `
            from(bucket: "${bucket}") 
                |> range(start: -${hrCount}h)
                |> filter(fn: (r) => r._measurement == "metrics_${id}")
                |> filter(fn: (r) => r._field == "cpuUsage")
                |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
                |> keep(columns: ["_time", "cpuUsage"])
        `;

        const metrics: MetricsResponse[] = [];

        return await new Promise<any>((resolve, reject) => {
            queryApi.queryRows(query, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    metrics.push({ time: o._time, cpuUsage: o.cpuUsage })
                },
                error() { },
                complete() {
                    resolve(metrics)
                }
            })
        })
    }
}
