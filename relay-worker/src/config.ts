export interface RelayWorkerConfig {
    KAFKA_HOSTS: string;
    KAFKA_CLIENT_ID: string;
    KAFKA_GROUP_ID: string;
    PG_HOST: string;
    PG_PORT: number;
    PG_DB_NAME: string;
    PG_PASS: string;
    PG_USER: string;
    CLICKHOUSE_USER: string;
    CLICKHOUSE_HOST: string;
    CLICKHOUSE_PASSWORD: string;
    CLICKHOUSE_DATABASE: string;
    TRACEO_API_KEY: string;
    TRACEO_HOST: string;
}

const defaultConfig = (): RelayWorkerConfig => {
    return {
        KAFKA_CLIENT_ID: "traceo-kafka",
        KAFKA_HOSTS: "localhost:29092",
        KAFKA_GROUP_ID: "traceo-kafka-group",
        PG_DB_NAME: "traceo_local",
        PG_HOST: "localhost",
        PG_PASS: "postgres",
        PG_PORT: 5432,
        PG_USER: "postgres",
        CLICKHOUSE_USER: 'default',
        CLICKHOUSE_HOST: 'http://localhost:8123',
        CLICKHOUSE_PASSWORD: '',
        CLICKHOUSE_DATABASE: `traceo_${process.env.NODE_ENV}`,
        TRACEO_API_KEY: "tr_6a93f71e-6500-475b-a02b-f22bdae08d82",
        TRACEO_HOST: "http://localhost:3000/"
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
