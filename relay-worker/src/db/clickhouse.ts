import { RelayWorkerConfig } from "../config";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from "..";

export enum CLICKHOUSE_TABLE {
    LOGS = "logs",
    MERICS = "metrics",
    PERFORMANCE = "performance"
}

export const createClickhouseClient = async (configs: RelayWorkerConfig): Promise<ClickHouseClient> => {
    logger.log('☢ Connection to Clickhouse ...');

    const clickhouse = createClient({
        host: configs.CLICKHOUSE_HOST,
        username: configs.CLICKHOUSE_USER,
        password: configs.CLICKHOUSE_PASSWORD,
        database: configs.CLICKHOUSE_DATABASE
    });

    await clickhouse.query({
        query: 'SELECT 1'
    }).catch((err) => {
        logger.error(err);
        ExceptionHandlers.catchException(`❌ Cannot connect to Clickhouse instance. Caused by: ${err}`);

        throw err;
    });

    logger.log('✔ Clickhouse is ready.');

    return clickhouse;
}
