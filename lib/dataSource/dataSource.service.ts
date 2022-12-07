import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Application } from '../db/entities/application.entity';
import { InfluxService } from './influx/influx.service';
import { ApplicationNotExistsError } from '../helpers/errors';
import { MetricsQuery, MetricsResponse } from '../../lib/types/interfaces/metrics.interface';
import { TSDB } from '../../lib/types/enums/tsdb.enum';
import { ApiResponse } from '../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../lib/helpers/constants';
import { IInfluxDs } from '../../lib/types/interfaces/influxds.interface';

@Injectable()
export class DataSourceService {
    private logger: Logger;
    constructor(
        private readonly entityManager: EntityManager,
        private readonly influxService: InfluxService
    ) {
        this.logger = new Logger(DataSourceService.name);
    }

    private async getDataSourceOrThrowError(id: string) {
        const app = await this.entityManager.getRepository(Application).findOneBy({ id });
        if (!app) {
            throw new ApplicationNotExistsError();
        }

        if (!app?.connectedTSDB || !app.influxDS) {
            return null;
        }

        return app;
    }

    async getMetrics(query: MetricsQuery): Promise<ApiResponse<MetricsResponse[]>> {
        const app = await this.getDataSourceOrThrowError(query.id);
        if (!app) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                const response = await this.influxService.queryData(app.influxDS, query);
                return new ApiResponse("success", undefined, response);
            }
            default:
                return;
        }
    }

    async getConnectedDataSource(id: string): Promise<ApiResponse<IInfluxDs>> {
        const app = await this.getDataSourceOrThrowError(id);
        if (!app) {
            return;
        }
        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                const response = app?.influxDS;
                return new ApiResponse("success", undefined, response);
            }
            default:
                return null;
        }
    }

    async removeDataSource(id: string): Promise<ApiResponse<unknown>> {
        return this.entityManager.transaction(async (manager) => {
            const app = await this.getDataSourceOrThrowError(id);
            if (!app) {
                return;
            }

            await manager.getRepository(Application).update({ id }, { connectedTSDB: null });

            switch (app.connectedTSDB) {
                case TSDB.INFLUX2: {
                    await manager.getRepository(Application).update({ id }, { influxDS: null })
                    return new ApiResponse("success", "Data source removed");
                }
                default:
                    return;
            }
        }).catch((err: Error) => {
            this.logger.error(`[${this.removeDataSource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }
}
