import { RelayWorkerConfig } from "./config";
import { Kafka } from "kafkajs";
import { Pool } from "pg";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { createPostgresPool, DatabaseService } from "./database";
import { createKafkaClient } from "./kafka";
import { logger } from ".";

export interface Core {
    kafka: Kafka;
    db: DatabaseService;
};

export const initWorker = async (
    configs: RelayWorkerConfig,
): Promise<{ core: Core, shutdown: () => Promise<void> }> => {
    logger.debug('☢ Starting traceo worker ...')

    logger.log('☢ Connection to Kafka ...');

    const kafka = await createKafkaClient(configs);
    const producer = kafka.producer({
        retry: {
            retries: 10,
            initialRetryTime: 1000,
            maxRetryTime: 30
        }
    });

    await producer.connect();
    logger.log('✔ Kafka is ready.')

    logger.log('☢ Connection to Postgres ...');

    let pgPool: Pool = undefined;
    try {
        pgPool = createPostgresPool(configs);
        await pgPool.connect();
        // Simple query to check connection
        await pgPool.query('SELECT datname FROM pg_database;');

        logger.log('✔ Postgres is ready.');
    } catch (err) {
        logger.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        ExceptionHandlers.catchException(err);
    } finally {
        pgPool.end();
    }

    const db = new DatabaseService(pgPool);

    return {
        core: {
            kafka,
            db
        },
        shutdown: async () => {
            Promise.all([
                await producer.disconnect(),
                await pgPool?.end()
            ]);
        }
    };
}
