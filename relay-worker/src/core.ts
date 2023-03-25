import { RelayWorkerConfig } from "./config";
import { createKafkaClient, startEventConsumer } from "./kafka";
import { logger } from ".";
import { Core } from "./types";
import { createClickhouseClient, createPostgresClient, DatabaseService } from "./db";

export const initWorker = async (
    configs: RelayWorkerConfig,
): Promise<{ core: Core }> => {
    logger.debug('☢ Starting traceo worker ...')

    let core: Core = undefined;

    const { kafka, producer } = await createKafkaClient(configs);
    const { client, pool } = await createPostgresClient(configs);
    const clickhouse = await createClickhouseClient(configs);

    const db = new DatabaseService(pool, client, clickhouse);

    core = {
        kafka,
        kafkaProducer: producer,
        db,
        clickhouse
    };

    const consumer = await startEventConsumer({ configs, core });

    const onShutdown = async () => {
        logger.debug('☢ Worker shutdown in progress. Trying to disconnect from kafka producer/consumer ...');

        Promise.all([
            producer?.disconnect(),
            consumer?.disconnect(),
            clickhouse?.close()
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
