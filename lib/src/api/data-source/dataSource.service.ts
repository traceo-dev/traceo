import { Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from '@common/helpers/constants';
import { ApplicationNotExistsError } from '@common/helpers/errors';
import { ApiResponse } from '@common/types/dto/response.dto';
import { TSDB_PROVIDER } from '@shared/enums/tsdb.enum';
import { IInfluxDs } from '@shared/interfaces/influxds.interface';
import { Application } from '@db/entities/application.entity';
import { EntityManager } from 'typeorm';
import { BaseDataSourceDto } from '@common/types/dto/data-source';
import { InfluxService } from '../../providers/influx/influx.service';
import { DataSourceConnStatus } from '@shared/interfaces/tsdb.interface';

@Injectable()
export class DataSourceService {
    private logger: Logger;
    constructor(
        private readonly entityManager: EntityManager,
        private readonly influxService: InfluxService
    ) {
        this.logger = new Logger(DataSourceService.name);
    }

    public async checkConnection(appId: string): Promise<ApiResponse<DataSourceConnStatus>> {
        const app = await this.getDataSourceOrThrowError(appId);

        if (!app) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB_PROVIDER.INFLUX2: {
                if (!app.influxDS) {
                    return;
                }
                return await this.influxService.checkConnection(appId);
            }
            default:
                return null;
        }
    }

    public async getDataSourceOrThrowError(id: string) {
        const app = await this.entityManager.getRepository(Application).findOneBy({ id });
        if (!app) {
            throw new ApplicationNotExistsError();
        }

        if (!app?.connectedTSDB || !app.influxDS) {
            return null;
        }

        return {
            connectedTSDB: app.connectedTSDB,
            influxDS: app.influxDS
        };
    }

    /**
     * TODO: more abstraction here and remove this switch/case by using abstract classes for providers,
     * This same for removeDataSource method
     */

    async saveDataSource<T extends BaseDataSourceDto>(
        config: T
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        switch (config.provider) {
            case TSDB_PROVIDER.INFLUX2: {
                return await this.influxService.saveInfluxDataSource(config);
            }
            default:
                return null;
        }
    }

    async getConnectedDataSource(id: string): Promise<ApiResponse<IInfluxDs>> {
        const app = await this.getDataSourceOrThrowError(id);
        if (!app) {
            return;
        }
        switch (app.connectedTSDB) {
            case TSDB_PROVIDER.INFLUX2: {
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

            switch (app.connectedTSDB) {
                case TSDB_PROVIDER.INFLUX2: {
                    await manager.getRepository(Application).update({ id }, { connectedTSDB: null, influxDS: null })
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
