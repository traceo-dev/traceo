import { Pool, PoolClient, QueryResult } from "pg";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from "..";
import { Dictionary, IProject, IEvent, IIncident, LogEventPayload, MetricsEventPayload, SafeReturnType, TimeSerieMetric, BrowserPerfsPayloadEvent } from "@traceo/types";
import dayjs from "dayjs";
import format from "pg-format";
import { ClickHouseClient } from "@clickhouse/client";
import { CLICKHOUSE_TABLE } from "./clickhouse";
import { randomUUID } from "crypto";
import { flatObject } from "../utils";

export class DatabaseService {
    pool: Pool;
    client: PoolClient;
    clickClient: ClickHouseClient;

    constructor(
        pool: Pool,
        postgres: PoolClient,
        clickClient: ClickHouseClient
    ) {
        this.pool = pool;
        this.client = postgres;
        this.clickClient = clickClient;
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

    public async getProjectById(id: string, client: PoolClient = this.client): Promise<IProject | undefined> {
        const result = await client.query<IProject>(`SELECT * FROM project WHERE id = '${id}'`);
        return result.rows[0];
    }

    public async getIncident({ name, message, projectId }: { name: string, message: string, projectId: string }, client: PoolClient = this.client): Promise<IIncident | undefined> {
        const result = await client.query<IIncident>(`SELECT * FROM incident WHERE name = $1 AND message = $2 AND project_id = $3`, [name, message, projectId]);
        return result.rows[0];
    }

    private async updateProjectLastEventAt(projectId: string, date: number, client: PoolClient = this.client): Promise<void> {
        await client.query(`UPDATE project SET last_event_at = '${date}' WHERE id = '${projectId}'`)
    }

    public async createIncident({
        sdk, status, stack, name, message, createdAt, project, platform, traces
    }: Partial<IIncident>, {
        details, date
    }: Partial<IEvent>,
        client: PoolClient = this.client
    ): Promise<IIncident> {
        /**
         * Function to insert new incident in postgres db. Should be run within new transaction by
         * using postgresTransaction and this same client instance passed to function attribute.
         * 
         * 1. Insert new incident 
         * 2. Update last_incident_at in project table
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
                project_id, 
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
            project.id,
            platform
        ]);

        await this.updateProjectLastEventAt(project.id, date);

        const insertedRow = result.rows[0];
        await this.createEvent({
            incident: insertedRow,
            project,
            date,
            details
        }, client);

        return insertedRow;
    }

    public async createEvent({ date, details, incident, project }: Partial<IEvent>, client: PoolClient = this.client): Promise<IEvent> {
        const result = await client.query<IEvent>(`
            INSERT INTO event (
                date,
                incident_id,
                project_id,
                details
            ) VALUES ($1, $2, $3, $4) 
            RETURNING *        
        `, [
            date,
            incident.id,
            project.id,
            details
        ]);

        await client.query(`UPDATE incident SET last_event_at = '${date}' WHERE id = '${incident.id}'`)
        await this.updateProjectLastEventAt(project.id, date);

        return result.rows[0];
    }

    public async insertRuntimeConfigs({ config, projectId }: { config: Dictionary<SafeReturnType>, projectId: string }): Promise<any> {
        const insertedRows = await this.postgresQuery<Dictionary<SafeReturnType>>(`UPDATE project SET runtime_config = '${JSON.stringify(config)}' WHERE id = '${projectId}'`)
        return insertedRows.rows[0];
    }

    // Clickhouse queries

    public async insertClickhouseLogs({ logs, projectId }: { logs: LogEventPayload[], projectId: string }): Promise<number> {
        const now = dayjs().unix();

        const values = logs.map((log) => ({
            id: randomUUID(),
            message: log.message,
            timestamp: log.timestamp,
            receive_timestamp: now,
            precise_timestamp: log.unix,
            level: log.level,
            project_id: projectId,
            resources: JSON.stringify(log.resources)
        }));

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.LOGS,
            format: "JSONEachRow",
            values: values,
        });

        return values.length;
    }

    public async insertClickhouseMetrics({ project_id, payload }: { project_id: string, payload: MetricsEventPayload }) {
        const now = dayjs().unix();

        const metrics = Object.entries(flatObject(payload)).map(([key, value]) => ({
            id: randomUUID(),
            name: key,
            value: value,
            project_id: project_id,
            timestamp: now,
            receive_timestamp: now
        })) as TimeSerieMetric[];

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.MERICS,
            format: "JSONEachRow",
            values: metrics
        });

        return metrics.length;
    }

    public async insertClickhouseBrowserPerformance({ projectId, payload }: { projectId: string, payload: BrowserPerfsPayloadEvent[] }) {
        const now = dayjs().unix();

        const perfs = payload.flatMap(item => item.performance.map(perf => ({
            id: randomUUID(),
            name: perf.name,
            value: perf.value,
            unit: perf.unit,
            event: item.event,
            browser_name: item.browser.name,
            browser_version: item.browser.version,
            platform_type: item.platform.type,
            timestamp: item.timestamp,
            view: item.view,
            receive_timestamp: now,
            project_id: projectId
        })));

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.PERFORMANCE,
            format: "JSONEachRow",
            values: perfs
        });

        return perfs.length;
    }
}