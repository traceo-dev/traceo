import { Injectable, Logger } from '@nestjs/common';
import { Environment } from 'app/src/types/releases';
import { EntityManager } from 'typeorm';
import { InfluxDB } from '@influxdata/influxdb-client'
import { InfluxConfigurationBody } from './influx.model';
import { InfluxDS } from 'lib/db/entities/influxds.entity';
import { Application } from 'lib/db/entities/application.entity';
import tokenService from 'lib/helpers/tokens';
import { TSDB } from 'lib/types/tsdb';

@Injectable()
export class InfluxService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async saveInfluxDataSource(config: InfluxConfigurationBody): Promise<void> {
        const { appId, ...rest } = config;

        await this.entityManager.transaction(async (manager) => {
            const ds = await manager.getRepository(InfluxDS).findOneBy({
                application: {
                    id: appId
                }
            });

            const dataSource = {
                ...rest,
                application: {
                    id: appId
                },
                interval: rest?.interval > 30 ? rest.interval : 30,
                token: tokenService.generate(rest.token)
            }

            if (!ds) {
                await manager.getRepository(InfluxDS).save(dataSource);
                await manager.getRepository(Application).update({ id: appId }, { connectedTSDB: TSDB.INFLUX2 })

                Logger.log(`InfluxDB data source attached to app: ${appId}`);
                return;
            }

            await manager.getRepository(InfluxDS).update({ id: ds.id }, dataSource);
            Logger.log(`InfluxDB data source updated in app: ${appId}`);
        });
    }

    async client(id: number): Promise<{ client: InfluxDB, bucket: string, org: string }> {
        const ds = await this.entityManager.getRepository(InfluxDS).findOneBy({
            application: {
                id
            }
        });

        if (!ds) {
            throw new Error('InfluxDS data source not found!');
        }

        const { url, token, bucket, org } = ds;
        const client = new InfluxDB({ url, token });

        return {
            client, bucket, org
        }
    }

    async writeData(): Promise<void> {

    }

    async queryData(): Promise<void> { }
}
