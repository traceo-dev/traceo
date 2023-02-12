import { Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from '@common/helpers/constants';
import { ApiResponse } from '@common/types/dto/response.dto';
import { ConnectionStatus, DataSourceConnStatus, DatasourceProvider } from '@traceo/types';
import { Application } from '@db/entities/application.entity';
import { EntityManager } from 'typeorm';
import { BaseDataSourceDto } from '@common/types/dto/data-source';
import { InfluxService } from '../../providers/influx/influx.service';
import { Datasource } from '@db/entities/datasource.entity';
import dateUtils from '@common/helpers/dateUtils';
import { BaseProviderService } from '@common/base/provider/base-provider.service';

@Injectable()
export class DataSourceService {
    private logger: Logger;
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.logger = new Logger(DataSourceService.name);
    }

    async getDatasource(datasourceId: string): Promise<ApiResponse<Datasource>> {
        try {
            // TypeORM is weird and when id is null/undefined then return first record from table...
            if (!datasourceId) {
                return new ApiResponse("success", undefined, undefined);
            }
            const ds = await this.entityManager.getRepository(Datasource).findOneBy({ id: datasourceId });
            return new ApiResponse("success", undefined, ds);
        } catch (err) {
            this.logger.error(`[${this.getDatasource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    async saveDatasource(
        config: BaseDataSourceDto,
        manager: EntityManager = this.entityManager
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        let datasourceId = config?.id;
        const { provider, appId, url, details } = config;

        if (!provider || !appId || !url) {
            throw new Error("Missing required fields!");
        }

        return await manager.transaction(async (manager) => {
            if (datasourceId) {
                await manager.getRepository(Datasource).update({ id: datasourceId }, {
                    updatedAt: dateUtils.toUnix(),
                    url,
                    type: config.provider,
                    details
                });
            } else {
                const app = await manager.getRepository(Application).findOneBy({ id: appId });
                if (!app) {
                    throw new Error("App not found!");
                }

                const ds = await manager.getRepository(Datasource).save({
                    appId,
                    url,
                    type: config.provider,
                    createdAt: dateUtils.toUnix(),

                    //TODO: details should be encrypted before saving to db
                    details
                });

                await manager.getRepository(Application).update({ id: appId }, {
                    tsdbDatasource: ds.id
                });

                datasourceId = ds.id;
            }

            const connection = await this.heartbeat(datasourceId, manager);
            return new ApiResponse("success", "Datasource saved", {
                status: connection.data["status"],
                statusMessage: connection.message
            });
        }).catch((err) => {
            this.logger.error(`[${this.saveDatasource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }

    async removeDataSource(id: string): Promise<ApiResponse<unknown>> {
        return await this.entityManager.transaction(async (manager) => {
            await manager.getRepository(Datasource).delete({ id });
            await manager.getRepository(Application).update({ tsdbDatasource: id }, {
                tsdbDatasource: null
            });

            return new ApiResponse("success", undefined, undefined);
        }).catch((err) => {
            this.logger.error(`[${this.removeDataSource.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        });
    }

    public async heartbeat(datasourceId: string, manager = this.entityManager): Promise<ApiResponse<DataSourceConnStatus>> {
        if (!datasourceId) {
            return new ApiResponse("success", undefined, undefined);
        }

        const ds = await manager.getRepository(Datasource).findOneBy({ id: datasourceId });

        const connectionCheckers = new Map<DatasourceProvider, BaseProviderService>([
            [DatasourceProvider.INLFUX_DB, new InfluxService(this.entityManager)],
        ]);

        const connectionChecker = connectionCheckers.get(ds.type);
        return await connectionChecker.healthCheck(ds);
    }
}
