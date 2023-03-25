import { Pool, PoolClient, QueryResult } from "pg";
import { RelayWorkerConfig } from "./config";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from ".";
import { Dictionary, IApplication, IEvent, IIncident, LogEventPayload, SafeReturnType } from "@traceo/types";
import dayjs from "dayjs";
import format from "pg-format";

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
    pool: Pool;
    client: PoolClient;

    constructor(
        pool: Pool,
        postgres: PoolClient
    ) {
        this.pool = pool;
        this.client = postgres;
    }

    /**
     * Make SQL query to postgres db.
     * Remember to made reference to values in query by using $1, $2
     * and the appropriate order of setting the values relative to the fields.
     * 
     * eq. INSERT INTO account (name, email) VALUES ($1, $2)
     */
    public async postgresQuery<R>(queryString: string, values?: (string | number | undefined | {})[]): Promise<QueryResult<R>> {
        return await this.client.query(queryString, values)
    }

    /**
     * Bulk insert with pg-format library to parse query. %L char is used to inject values
     * which should be passed in ['a', 1, 'b', 2] format.
     */
    public async postgrseBulkInsert<T>(query: string, values: (string | number | undefined)[][]): Promise<number> {
        const insertedRows = await this.postgresQuery<T>(format(`${query} VALUES %L`, values));
        return insertedRows.rowCount;
    }

    public async postgresTransaction<T>(
        callback: (client: PoolClient) => Promise<T>
    ): Promise<any> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(this.client);
            await client.query('COMMIT');

            return result;
        } catch (err) {
            await client.query('ROLLBACK');

            logger.error(`❌ The Postgres transaction has been rolled back. Caused by: ${err}`)
            ExceptionHandlers.catchException(err);

            throw err;
        } finally {
            client.release();
        }
    }

    public async getApplicationById(id: string, client: PoolClient = this.client): Promise<IApplication | undefined> {
        const result = await client.query<IApplication>(`SELECT * FROM application WHERE id = '${id}'`);
        return result.rows[0];
    }

    public async getIncident({ name, message, appId }: { name: string, message: string, appId: string }, client: PoolClient = this.client): Promise<IIncident | undefined> {
        const result = await client.query<IIncident>(`SELECT * FROM incident WHERE name = $1 AND message = $2 AND application_id = $3`, [name, message, appId]);
        return result.rows[0];
    }

    private async updateApplicationLastEventAt(appId: string, date: number, client: PoolClient = this.client): Promise<void> {
        await client.query(`UPDATE application SET last_event_at = '${date}' WHERE id = '${appId}'`)
    }

    public async createIncident({
        sdk, status, stack, name, message, createdAt, application, platform, traces
    }: Partial<IIncident>, {
        browser, date
    }: Partial<IEvent>,
        client: PoolClient = this.client
    ): Promise<IIncident> {
        /**
         * Function to insert new incident in postgres db. Should be run within new transaction by
         * using postgresTransaction and this same client instance passed to function attribute.
         * 
         * 1. Insert new incident 
         * 2. Update last_incident_at in application table
         * 3. Insert new event
         */
        const result = await client.query<IIncident>(`
            INSERT INTO incident (
                sdk, 
                status, 
                stack, 
                traces, 
                name, 
                message, 
                created_at,
                last_event_at,
                application_id, 
                platform
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            sdk,
            status,
            stack,
            JSON.stringify(traces),
            name,
            message,
            createdAt,
            date,
            application.id,
            platform
        ]);

        await this.updateApplicationLastEventAt(application.id, date);

        const insertedRow = result.rows[0];
        await this.createEvent({
            incident: insertedRow,
            application,
            date,
            browser
        }, client);

        return insertedRow;
    }

    public async createEvent({ date, browser, incident, application }: Partial<IEvent>, client: PoolClient = this.client): Promise<IEvent> {
        const result = await client.query<IEvent>(`
            INSERT INTO event (
                date,
                incident_id,
                application_id,
                browser
            ) VALUES ($1, $2, $3, $4) 
            RETURNING *        
        `, [
            date,
            incident.id,
            application.id,
            browser
        ]);

        await client.query(`UPDATE incident SET last_event_at = '${date}' WHERE id = '${incident.id}'`)
        await this.updateApplicationLastEventAt(application.id, date);

        return result.rows[0];
    }

    public async insertBulkLogs({ logs, appId }: { logs: LogEventPayload[], appId: string }): Promise<number> {
        const now = dayjs().unix();

        const values = logs.map(({ level, message, resources, timestamp, unix }) => [
            level,
            message,
            timestamp,
            unix,
            now,
            appId,
            JSON.stringify(resources),
        ]);

        const query = 'INSERT INTO log (level, message, timestamp, receive_timestamp, created_at, application_id, resources)';
        const rowsCount = await this.postgrseBulkInsert(query, values);
        return rowsCount;
    }

    public async insertRuntimeConfigs({ config, appId }: { config: Dictionary<SafeReturnType>, appId: string }): Promise<any> {
        const insertedRows = await this.postgresQuery<Dictionary<SafeReturnType>>(`UPDATE application SET runtime_config = '${JSON.stringify(config)}' WHERE id = '${appId}'`)
        return insertedRows.rows[0];
    }
}