import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { Application } from '../../db/entities/application.entity';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import { InfluxConfigurationDto } from '../../common/types/dto/influx.dto';
import { IInfluxDs } from '../../common/types/interfaces/influxds.interface';
import { IDefaultSDKMetrics, ISDKMetrics, MetricsResponse } from '../../common/types/interfaces/metrics.interface';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { CONNECTION_STATUS, TSDB_PROVIDER } from '../../common/types/enums/tsdb.enum';
import { DataSourceConnStatus } from '../../common/types/interfaces/tsdb.interface';
import { MetricQueryDto } from '../../common/types/dto/metrics.dto';
import { BaseDataSourceDto } from '../../common/types/dto/data-source';


/**
 * TODO: Every TSDB provider (eq. Influx, Flux, Prometheus etc.) should be extended by base abstract class, 
 * In [Provider]Service should be logic defined only for a given provider and in BaseService only common logic.
 */

@Injectable()
export class InfluxService {
    private logger: Logger;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(InfluxService.name);
    }

    public async saveInfluxDataSource<T extends BaseDataSourceDto>(config: T): Promise<ApiResponse<DataSourceConnStatus>> {
        const { appId } = config;

        return this.entityManager.transaction(async (manager) => {
            const { error, status } = await this.checkAndUpdateConnectionStatus(appId, config, manager);

            this.logger.log(`InfluxDB data source updated in app: ${appId}`);
            return new ApiResponse("success", "InfluxDB data source updated", {
                status, error
            });
        }).catch((err: Error) => {
            this.logger.error(`[${this.saveInfluxDataSource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }

    public async checkConnection(appId: string): Promise<ApiResponse<DataSourceConnStatus>> {
        try {
            const { status, error } = await this.checkAndUpdateConnectionStatus(appId)
            return new ApiResponse("success", undefined, {
                status,
                error
            })
        } catch (err) {
            this.logger.error(`[${this.checkConnection.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    private async checkAndUpdateConnectionStatus<T extends BaseDataSourceDto>(
        appId: string,
        config?: T,
        manager: EntityManager = this.entityManager
    ): Promise<DataSourceConnStatus> {
        let state: DataSourceConnStatus;

        // TODO: trash here
        if (!config) {
            const app = await manager.getRepository(Application).findOneBy({ id: appId });
            state = await this.connectionTest({ ...app.influxDS });
            await manager.getRepository(Application).update({ id: appId }, {
                influxDS: { ...app.influxDS, connError: state.error, connStatus: state.status },
                connectedTSDB: TSDB_PROVIDER.INFLUX2
            });
        } else {
            state = await this.connectionTest({ ...config });
            await manager.getRepository(Application).update({ id: appId }, {
                influxDS: { ...config, connError: state.error, connStatus: state.status },
                connectedTSDB: TSDB_PROVIDER.INFLUX2
            });
        }

        return {
            ...state
        }
    }

    public async writeData(appId: string, config: Partial<IInfluxDs>, data: ISDKMetrics): Promise<void> {
        const { bucket, url, token, org } = config;

        if (!url || !token) {
            this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
            return;
        }

        const appRef = this.entityManager.getRepository(Application);

        const influxDb = new InfluxDB({ url, token });
        const write = influxDb.getWriteApi(org, bucket);

        const defaultPoint = this.saveDefaultMetrics(appId, data.default);

        write.writePoint(defaultPoint);
        write
            .close()
            .then(async () => {
                this.logger.log(`New metrics write to InfluxDB for appId: ${appId}`);

                if (config.connStatus === CONNECTION_STATUS.FAILED) {
                    const influxDS = { ...config, connStatus: CONNECTION_STATUS.CONNECTED, connError: null };
                    await appRef.update({ id: appId }, { influxDS });
                }
            })
            .catch(async (error) => {
                this.logger.error(`Cannot write new metrics to InfluxDB for appId: ${appId}. Caused by: ${error}`);

                if (config.connStatus === CONNECTION_STATUS.CONNECTED) {
                    const influxDS = { ...config, connStatus: CONNECTION_STATUS.FAILED, connError: String(error["code"]) };
                    await appRef.update({ id: appId }, { influxDS });
                }
            });
    }

    private saveDefaultMetrics(applicationId: string, defaultMetrics: IDefaultSDKMetrics): Point {
        const point = new Point(`metrics_${applicationId}`);
        Object.entries(defaultMetrics).forEach(([key, value]) => point.floatField(key, value));
        return point;
    }

    private async connectionTest(
        config: Partial<InfluxConfigurationDto>
    ): Promise<DataSourceConnStatus> {
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

    /**
     * https://docs.influxdata.com/influxdb/v2.0/query-data/flux/
     */
    public async queryData(
        appId: string,
        config: IInfluxDs,
        dtoQuery: MetricQueryDto
    ): Promise<MetricsResponse[]> {
        const { url, token, org, bucket } = config;
        const { hrCount, fields } = dtoQuery;

        if (!url || !token) {
            this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
            return;
        }

        const influxDb = new InfluxDB({ url, token });
        const queryApi = influxDb.getQueryApi(org);

        const query = `
            from(bucket: "${bucket}")
                |> range(start: -${hrCount}h)
                |> filter(fn: (r) => r._measurement == "metrics_${appId}")
                |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
                |> keep(columns: [
                    "_time", ${fields.map((f) => `"${f}"`).join(', ')}
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
