import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InfluxDS } from 'lib/db/entities/influxds.entity';
import { Application } from 'lib/db/entities/application.entity';
import { TSDB } from 'lib/types/tsdb';

@Injectable()
export class DataSourceService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async getDataSource(id: number): Promise<InfluxDS> {
        const app = await this.entityManager.getRepository(Application).findOneBy({ id });

        if (!app) {
            throw new Error('App not found!');
        }

        if (!app?.connectedTSDB) {
            return null;
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
            const app = await manager.getRepository(Application).findOneBy({ id });
            if (!app) {
                throw new Error('App not found!');
            }

            if (!app.connectedTSDB) {
                throw new Error('This app is not connected to any data source!');
            }

            await manager.getRepository(Application).update({ id }, { connectedTSDB: null });

            switch (app.connectedTSDB) {
                case TSDB.INFLUX2: {
                    return await manager.getRepository(InfluxDS).delete({
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
