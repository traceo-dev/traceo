import { Pool } from "pg";
import { RelayWorkerConfig } from "../config";
import { Logger } from "../logger";

export const createPostgresClient = async (configs: RelayWorkerConfig) => {
    Logger.log('☢ Connection to Postgres ...');

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

        Logger.log('✔ Postgres is ready.');

        return { pool, client };
    } catch (err) {
        Logger.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        pool?.end();

        throw err;
    }
}
