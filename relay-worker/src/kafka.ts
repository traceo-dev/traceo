import { Consumer, Kafka } from "kafkajs";
import { RelayWorkerConfig } from "./config";
import { eventHandler } from "./handlers";
import { Core } from "./core";
import { KAFKA_TOPIC } from "@traceo/types";
import { logger } from ".";

export const createKafkaClient = async (configs: RelayWorkerConfig) => {
    const kafka = new Kafka({
        brokers: configs.KAFKA_HOSTS,
        clientId: configs.KAFKA_CLIENT_ID,
        connectionTimeout: 9000,
        authenticationTimeout: 9000,
        logLevel: configs.KAFKA_LOG_LEVEL
    });

    // Reload topics and create new one if not already exists

    const admin = kafka.admin()
    await admin.connect()

    const kafkaTopics = await admin.listTopics()

    const topicsToCreate = Object.values(KAFKA_TOPIC).filter((t) => !kafkaTopics.includes(t)).map((topic) => ({ topic }));
    if (topicsToCreate.length > 0) {
        await admin.createTopics({
            waitForLeaders: true,
            topics: topicsToCreate,
        });
        logger.log(`New Kafka topics: ${topicsToCreate}`);
    }
    await admin.disconnect()

    return kafka;
}

export const startEventConsumer = async (
    { configs, core }: { configs: RelayWorkerConfig, core: Core }
): Promise<Consumer> => {
    const kafka: Kafka = core?.kafka ?? await createKafkaClient(configs);
    const consumer = kafka.consumer({
        groupId: configs.KAFKA_CLIENT_ID,
        sessionTimeout: configs.KAFKA_SESSION_TIMEOUT
    });

    consumer.on('consumer.group_join', ({ payload }) => {
        logger.info(`✔ Kafka join group: ${payload.groupId}`)
    });

    consumer.on('consumer.connect', () => {
        logger.info('✔ Kafka consumer connected.')
    });

    consumer.on('consumer.disconnect', () => {
        logger.info('❌ Kafka consumer disconnected!')
    });

    const topics: string[] = Object.values(KAFKA_TOPIC).map((topic) => topic);

    await consumer.connect();
    await consumer.subscribe({ topics });
    await consumer.run({
        eachBatchAutoResolve: false,
        autoCommitInterval: configs.KAFKA_AUTOCOMMIT_INTERVAL,
        autoCommitThreshold: configs.KAFKA_AUTOCOMMIT_TRESHOLD,
        eachMessage: async ({ message, topic }) => eventHandler[topic](message)
    });

    return consumer;
}

