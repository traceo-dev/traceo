import { RelayWorkerConfig } from "./config";
import { Kafka } from "kafkajs";
import { Pool, PoolClient } from "pg";
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
): Promise<{ core: Core }> => {
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
    let pgClient: PoolClient = undefined;
    let db: DatabaseService = undefined;

    try {
        pgPool = createPostgresPool(configs);
        pgClient = await pgPool.connect();

        // Simple query to check connection
        await pgPool.query('SELECT datname FROM pg_database;');

        logger.log('✔ Postgres is ready.');

        db = new DatabaseService(pgPool, pgClient);
    } catch (err) {
        logger.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        ExceptionHandlers.catchException(err);

        pgPool?.end();
    }

    const core: Core = {
        kafka,
        db
    }

    return { core };
}
