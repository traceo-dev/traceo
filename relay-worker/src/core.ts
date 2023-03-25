import { RelayWorkerConfig } from "./config";
import { Consumer, Kafka, Producer } from "kafkajs";
import { Pool, PoolClient } from "pg";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { createPostgresPool, DatabaseService } from "./database";
import { createKafkaClient, startEventConsumer } from "./kafka";
import { logger } from ".";
import { Core } from "./types";

export const initWorker = async (
    configs: RelayWorkerConfig,
): Promise<{ core: Core }> => {
    logger.debug('☢ Starting traceo worker ...')

    let core: Core = undefined;

    let kafka: Kafka = undefined;
    let kafkaProducer: Producer = undefined;
    let kafkaConsumer: Consumer = undefined;

    let pgPool: Pool = undefined;
    let pgClient: PoolClient = undefined;

    let db: DatabaseService = undefined;

    logger.log('☢ Connection to Kafka ...');
    kafka = await createKafkaClient(configs);

    kafkaProducer = kafka.producer({
        retry: {
            retries: 10,
            initialRetryTime: 1000,
            maxRetryTime: 30
        }
    });

    await kafkaProducer.connect();
    logger.log('✔ Kafka is ready.')

    logger.log('☢ Connection to Postgres ...');
    try {
        pgPool = createPostgresPool(configs);
        pgClient = await pgPool.connect();

        await pgPool.query('SELECT datname FROM pg_database;');
        logger.log('✔ Postgres is ready.');

        db = new DatabaseService(pgPool, pgClient);
    } catch (err) {
        logger.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        ExceptionHandlers.catchException(err);

        pgPool?.end();
    }

    core = {
        kafka,
        kafkaProducer,
        db
    };

    kafkaConsumer = await startEventConsumer({ configs, core });

    const onShutdown = async () => {
        logger.debug('☢ Worker shutdown in progress. Trying to disconnect from kafka producer/consumer ...');

        Promise.all([
            kafkaProducer?.disconnect(),
            kafkaConsumer?.disconnect()
        ]).catch((err) => {
            logger.error(err);
        });

        logger.info('🖐 Bye bye bye!');

        process.exit(0);
    }

    process.on('beforeExit', async () => await onShutdown());
    
    // https://www.baeldung.com/linux/sigint-and-other-termination-signals
    process.on('SIGINT', async () => await onShutdown());
    process.on('SIGTERM', async () => await onShutdown());
    process.on('SIGHUP', async () => await onShutdown());

    return { core };
}
