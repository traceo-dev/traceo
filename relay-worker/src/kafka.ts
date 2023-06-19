import { Consumer, Kafka, logLevel } from "kafkajs";
import { RelayWorkerConfig } from "./config";
import { eventHandler } from "./handlers";
import { KAFKA_TOPIC } from "@traceo/types";
import { Core } from "./types";

export const createKafkaClient = async (configs: RelayWorkerConfig) => {
    console.log('☢ Connection to Kafka ...');

    const kafka = new Kafka({
        brokers: configs.KAFKA_HOSTS.split(","),
        clientId: configs.KAFKA_CLIENT_ID,
        connectionTimeout: 9000,
        authenticationTimeout: 9000,
        logLevel: logLevel.WARN
    });

    // Reload topics and create new one if not already exists

    const admin = kafka.admin()
    await admin.connect()

    const kafkaTopics = await admin.listTopics()

    const topics = Object.values(KAFKA_TOPIC).filter((t) => !kafkaTopics.includes(t)).map((topic) => ({ topic }));
    if (topics.length > 0) {
        await admin.createTopics({ topics: topics });
        console.log(`✔ Created kafka topics: ${topics}`);
    }
    await admin.disconnect()

    const producer = kafka.producer({
        retry: {
            retries: 10,
            initialRetryTime: 1000,
            maxRetryTime: 30
        }
    });

    await producer.connect();

    console.log('✔ Kafka is ready.')

    return { kafka, producer };
}

export const startEventConsumer = async (
    { configs, core }: { configs: RelayWorkerConfig, core: Core }
): Promise<Consumer> => {
    const kafka: Kafka = core?.kafka;
    const consumer = kafka.consumer({
        groupId: configs.KAFKA_CLIENT_ID,
        sessionTimeout: 6000
    });

    consumer.on('consumer.group_join', ({ payload }) => {
        console.info(`✔ Kafka join group: ${payload.groupId}`)
    });

    consumer.on('consumer.connect', () => {
        console.info('✔ Kafka consumer connected.')
    });

    consumer.on('consumer.disconnect', () => {
        console.info('❌ Kafka consumer disconnected!')
    });

    const topics: string[] = Object.values(KAFKA_TOPIC).map((topic) => topic);

    try {
        await consumer.connect();
        await consumer.subscribe({ topics });
        await consumer.run({
            eachBatchAutoResolve: false,
            autoCommitInterval: 1000,
            autoCommitThreshold: 1000,
            eachMessage: async ({ message, topic }) => {
                await eventHandler({
                    core,
                    message,
                    topic: topic as KAFKA_TOPIC
                })
            }
        });
    } catch (err) {
        const message = `❌ Error while running kafka consumer: ${err}`;
        console.error(message);
        throw err;
    }

    return consumer;
}

