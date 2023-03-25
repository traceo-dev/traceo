import { ExceptionHandlers } from "@traceo-sdk/node";
import { Pool } from "pg";
import { logger } from "..";
import { RelayWorkerConfig } from "../config";

export const createPostgresClient = async (configs: RelayWorkerConfig) => {
    logger.log('☢ Connection to Postgres ...');

    const pool = new Pool({
        database: configs.PG_DB_NAME,
        user: configs.PG_USER,
        port: configs.PG_PORT,
        host: configs.PG_HOST,
        password: configs.PG_PASS,
        max: 10,
        idleTimeoutMillis: 500
    });

    try {
        const client = await pool.connect();

        /**
         * Check connection by select database name
         */
        await pool.query('SELECT datname FROM pg_database;');

        logger.log('✔ Postgres is ready.');

        return { pool, client };
    } catch (err) {
        logger.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        ExceptionHandlers.catchException(err);

        pool?.end();

        throw err;
    }
}
