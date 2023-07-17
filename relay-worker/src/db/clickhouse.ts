import { RelayWorkerConfig } from "../config";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { Logger } from "../logger";

export enum CLICKHOUSE_TABLE {
    LOGS = "logs",
    MERICS = "metrics",
    PERFORMANCE = "performance",
    TRACING = "tracing",
    EVENTS = "events"
}

export const createClickhouseClient = async (configs: RelayWorkerConfig): Promise<ClickHouseClient> => {
    Logger.log('☢ Connection to Clickhouse ...');

    const clickhouse = createClient({
        host: configs.CLICKHOUSE_HOST,
        username: configs.CLICKHOUSE_USER,
        password: configs.CLICKHOUSE_PASSWORD,
        database: configs.CLICKHOUSE_DATABASE
    });

    await clickhouse.query({
        query: 'SELECT 1'
    }).catch((err) => {
        throw err;
    });

    Logger.log('✔ Clickhouse is ready.');

    return clickhouse;
}
