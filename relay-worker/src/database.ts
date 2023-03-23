import { Client, Pool, PoolClient, QueryResult } from "pg";
import { RelayWorkerConfig } from "./config";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from ".";

export const createPostgresPool = (configs: RelayWorkerConfig): Pool => {
    const pgPool = new Pool({
        database: configs.PG_DB_NAME,
        user: configs.PG_USER,
        port: configs.PG_PORT,
        host: configs.PG_HOST,
        password: configs.PG_PASS,
        max: 10,
        idleTimeoutMillis: 500
    });

    return pgPool;
}

export class DatabaseService {
    postgres: Pool;
    client: PoolClient;

    constructor(postgres: Pool) {
        this.postgres = postgres;
    }

    public async query<R>(client: Client | Pool | PoolClient, queryString: string, values?: string[]): Promise<QueryResult<R>> {
        // TODO: wrap sql query to inclued values from params
        return await client.query(queryString, values)
    }

    public async postgresTransaction(
        callback: (client: PoolClient) => Promise<any>
    ): Promise<any> {
        const client = await this.postgres.connect();
        try {
            await client.query('BEGIN');
            const response = await callback(client);
            await client.query('COMMIT');

            return response;
        } catch (err) {
            if (client) {
                await client.query('ROLLBACK');
            }
            logger.error(err);
            ExceptionHandlers.catchException(err);

            throw err;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    // TODO: SQL QUERIES FOR NEEDED DATA
}