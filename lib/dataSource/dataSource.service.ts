import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDS } from '../db/entities/influxds.entity';
import { Application } from '../db/entities/application.entity';
import { MetricsQueryDto, MetricsResponse, TSDB } from '../types/tsdb';
import { InfluxService } from './influx/influx.service';
import { ApplicationNotExistsError } from 'lib/helpers/errors';

@Injectable()
export class DataSourceService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly influxService: InfluxService
    ) { }

    private async getDataSourceOrThrowError(id: number) {
        const app = await this.entityManager
            .getRepository(Application)
            .createQueryBuilder('application')
            .where('application.id = :id', { id })
            .leftJoinAndSelect('application.influxDS', 'influxDS')
            .getOne();

        if (!app) {
            throw new ApplicationNotExistsError();
        }

        if (!app?.connectedTSDB || !app.influxDS) {
            return null;
        }

        return app;
    }

    async getMetrics(query: MetricsQueryDto): Promise<MetricsResponse[]> {
        const app = await this.getDataSourceOrThrowError(query.id);
        if (!app) {
            return;
        }

        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                return await this.influxService.queryData({ ...app.influxDS }, query)
            }
            default:
                return;
        }
    }

    async getConnectedDataSource(id: number): Promise<InfluxDS> {
        const app = await this.getDataSourceOrThrowError(id);
        if (!app) {
            return;
        }
        switch (app.connectedTSDB) {
            case TSDB.INFLUX2: {
                return await this.entityManager.getRepository(InfluxDS).findOneBy({
                    application: {
                        id
                    }
                })
            }
            default:
                return null;
        }
    }

    async removeDataSource(id: number): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            const app = await this.getDataSourceOrThrowError(id);
            if (!app) {
                return;
            }

            await manager.getRepository(Application).update({ id }, { connectedTSDB: null });

            switch (app.connectedTSDB) {
                case TSDB.INFLUX2: {
                    await manager.getRepository(Application).update({ id }, { influxDS: null })
                    await manager.getRepository(InfluxDS).delete({
                        application: {
                            id
                        }
                    });
                }
                default:
                    return;
            }
        })
    }
}
