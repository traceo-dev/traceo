import { logLevel } from "kafkajs";

export interface RelayWorkerConfig {
    KAFKA_HOSTS: string[];
    KAFKA_CLIENT_ID: string;
    KAFKA_GROUP_ID: string;
    KAFKA_AUTOCOMMIT_INTERVAL: number;
    KAFKA_AUTOCOMMIT_TRESHOLD: number;
    KAFKA_SESSION_TIMEOUT: number;
    KAFKA_LOG_LEVEL: logLevel;
    PG_HOST: string;
    PG_PORT: number;
    PG_DB_NAME: string;
    PG_PASS: string;
    PG_USER: string;
    TRACEO_APP_ID: string;
    TRACEO_API_KEY: string;
    TRACEO_HOST: string;
}

const defaultConfig = (): RelayWorkerConfig => {
    return {
        KAFKA_AUTOCOMMIT_INTERVAL: 1000,
        KAFKA_AUTOCOMMIT_TRESHOLD: 1000,
        KAFKA_CLIENT_ID: "traceo-kafka",
        KAFKA_HOSTS: ["localhost:29092"],
        KAFKA_SESSION_TIMEOUT: 6000,
        KAFKA_GROUP_ID: "traceo-kafka-group",
        KAFKA_LOG_LEVEL: logLevel.WARN,
        PG_DB_NAME: "traceo_local",
        PG_HOST: "localhost",
        PG_PASS: "postgres",
        PG_PORT: 5432,
        PG_USER: "postgres",
        TRACEO_API_KEY: "b688d77a-49b6-47f3-80b4-b440ce48abf8",
        TRACEO_APP_ID: "9zYbDNsAjJyWXqZ",
        TRACEO_HOST: "http://ec2-3-71-18-115.eu-central-1.compute.amazonaws.com"
    }
}

export const relayWorkerConfigs = (): RelayWorkerConfig => {
    const envs = process.env;
    const newConfigs: RelayWorkerConfig = defaultConfig();
    for (const key of Object.keys(newConfigs)) {
        if (envs[key]) {
            newConfigs[key] = envs[key]
        } else {
            newConfigs[key] = newConfigs[key];
        }
    }

    return newConfigs;
}
