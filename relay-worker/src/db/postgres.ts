import { Pool } from "pg";
import { RelayWorkerConfig } from "../config";

export const createPostgresClient = async (configs: RelayWorkerConfig) => {
    console.log('☢ Connection to Postgres ...');

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

        console.log('✔ Postgres is ready.');

        return { pool, client };
    } catch (err) {
        console.error(`❌ Could not connect to Postgres. Caused by: ${err}`);
        pool?.end();

        throw err;
    }
}
