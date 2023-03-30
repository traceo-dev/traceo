export const CLICKHOUSE_DB_NAME = `${process.env.CLICKHOUSE_DATABASE}_${process.env.NODE_ENV}`;

export const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS ${CLICKHOUSE_DB_NAME}`;

export const CREATE_LOGS_TABLE = `
    CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DB_NAME}.logs (
        id UUID,
        message String,
        timestamp String,
        precise_timestamp UInt128,
        receive_timestamp UInt128,
        level String,
        project_id String,
        resources String
    ) 
    ENGINE = MergeTree() 
    ORDER BY id
`;

export const CREATE_METRICS_TABLE = `
    CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DB_NAME}.metrics (
        id UUID,
        name String,
        value Float64,
        timestamp UInt128,
        receive_timestamp DateTime,
        project_id String,
        resources String
    )
    ENGINE = MergeTree()
    TTL receive_timestamp + INTERVAL ${process.env.CLICKHOUSE_TTL || 14} DAY
    ORDER BY (id, timestamp)
`;

export const CREATE_BROWSER_PERFS_TABLE = `
    CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DB_NAME}.performance (
        id UUID,
        name String,
        value Float64,
        unit String,
        event String,
        timestamp UInt128,
        receive_timestamp DateTime,
        project_id String
    )
    ENGINE = MergeTree()
    TTL receive_timestamp + INTERVAL ${process.env.CLICKHOUSE_TTL || 14} DAY
    ORDER BY (id, timestamp)
`;