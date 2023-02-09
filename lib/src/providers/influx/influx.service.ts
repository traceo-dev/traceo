import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { Application } from '@db/entities/application.entity';
import { INTERNAL_SERVER_ERROR } from '@common/helpers/constants';
import { InfluxConfigurationDto } from '@common/types/dto/influx.dto';
import { IDefaultSDKMetrics, ISDKMetrics, MetricsResponse, IInfluxConfigDto, ConnectionStatus, TsdbProvider, DataSourceConnStatus } from '@traceo/types';
import { ApiResponse } from '@common/types/dto/response.dto';
import { MetricQueryDto } from '@common/types/dto/metrics.dto';
import { BaseDataSourceDto } from '@common/types/dto/data-source';


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
        const app = await manager.getRepository(Application).findOneBy({ id: appId });
        const dataSource = config ? { ...config } : { ...app.influxConfig };
        const state: DataSourceConnStatus = await this.connectionTest(dataSource);

        await manager.getRepository(Application).update({ id: appId }, {
            influxConfig: { ...dataSource, connError: state.error, connStatus: state.status },
            tsdbProvider: TsdbProvider.INFLUX2
        });

        return state;
    }

    public async writeData(appId: string, config: Partial<IInfluxConfigDto>, data: ISDKMetrics): Promise<void> {
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

                if (config.connStatus === ConnectionStatus.FAILED) {
                    const influxDS = { ...config, connStatus: ConnectionStatus.CONNECTED, connError: null };
                    await appRef.update({ id: appId }, { influxConfig: influxDS });
                }
            })
            .catch(async (error) => {
                this.logger.error(`Cannot write new metrics to InfluxDB for appId: ${appId}. Caused by: ${error}`);

                if (config.connStatus === ConnectionStatus.CONNECTED) {
                    const influxDS = { ...config, connStatus: ConnectionStatus.FAILED, connError: String(error["code"]) };
                    await appRef.update({ id: appId }, { influxConfig: influxDS });
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
                    status: ConnectionStatus.CONNECTED
                }
            })
            .catch(async (error) => {
                return {
                    status: ConnectionStatus.FAILED,
                    error: `${error["errno"]} : ${error["code"]}`
                }
            });
    }

    /**
     * https://docs.influxdata.com/influxdb/v2.0/query-data/flux/
     */
    public async queryData(
        appId: string,
        config: IInfluxConfigDto,
        dtoQuery: MetricQueryDto
    ): Promise<MetricsResponse[]> {
        const { url, token, org, bucket } = config;
        const { from, to, fields } = dtoQuery;

        if (!url || !token) {
            this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
            return;
        }

        const influxDb = new InfluxDB({ url, token });
        const queryApi = influxDb.getQueryApi(org);

        const query = `
            from(bucket: "${bucket}")
                |> range(start: ${from}, stop: ${to})
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
