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
        TRACEO_API_KEY: "e7a11d2d-d45b-4d23-a0be-ac79c435c5b3",
        TRACEO_APP_ID: "Pkh1qXCPj7jaz1D",
        TRACEO_HOST: "http://localhost:3000"
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
