import { Pool, PoolClient, QueryResult } from "pg";
import {
    IProject,
    IEvent,
    IIncident,
    LogEventPayload,
    BrowserPerfsPayloadEvent,
    getHealthByValue,
    VitalsEnum,
    TraceoSpan,
    TraceoMetric
} from "@traceo/types";
import dayjs from "dayjs";
import format from "pg-format";
import { ClickHouseClient } from "@clickhouse/client";
import { CLICKHOUSE_TABLE } from "./clickhouse";
import { randomUUID } from "crypto";
import { Logger } from "../logger";

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
            Logger.error(`❌ The Postgres transaction has been rolled back. Caused by: ${err}`)

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
        details
    }: Partial<IEvent>,
        client: PoolClient = this.client
    ): Promise<IIncident> {
        const now = dayjs().unix();
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
                platform,
                events_count
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            sdk,
            status,
            stack,
            JSON.stringify(traces),
            name ?? "<incident>",
            message,
            createdAt,
            now,
            project.id,
            platform,
            0
        ]);

        await this.updateProjectLastEventAt(project.id, now);

        const insertedRow = result.rows[0];
        await this.createEvent({
            incident_id: insertedRow.id,
            project_id: project.id,
            details: details
        });

        return insertedRow;
    }

    private async updateIncidentOnEvent({ incident_id, timestamp }: { incident_id: string, timestamp: number }): Promise<void> {
        await this.client.query(`
            UPDATE incident
            SET events_count = COALESCE(events_count, 0) + 1, last_event_at = '${timestamp}'
            WHERE id = '${incident_id}'
        `);
    }

    public async createEvent({ details, incident_id, project_id }: Partial<IEvent>): Promise<IEvent> {
        const timestamp = dayjs().unix();

        await this.updateIncidentOnEvent({ incident_id, timestamp });
        await this.updateProjectLastEventAt(project_id, timestamp);

        const event: IEvent = {
            id: randomUUID(),
            details: JSON.stringify(details),
            precise_timestamp: timestamp,
            incident_id,
            project_id,
            timestamp: timestamp
        };

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.EVENTS,
            format: "JSONEachRow",
            values: [event]
        });


        return event;
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

    public async insertClickhouseMetrics({ project_id, payload }: { project_id: string, payload: TraceoMetric[] }) {
        if (!project_id) {
            return;
        }

        const now = dayjs().unix();
        const insert = payload.map((metric) => ({
            id: randomUUID(),
            name: metric.name,
            value: metric.value,
            timestamp: metric.unixTimestamp,
            receive_timestamp: now,
            project_id
        }));

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.MERICS,
            format: "JSONEachRow",
            values: insert
        });

        return insert.length;
    }

    public async insertClickhouseSpans({ project_id, payload }: { project_id: string, payload: TraceoSpan[] }) {
        const now = dayjs().unix();

        const spans = payload.map((span) => {
             // nanos eq. 1691525415017000000
            const statrtEpochMillis = Number(BigInt(span.startEpochNanos) / BigInt(1000000));
            const endEpochMillis = Number(BigInt(span.endEpochNanos) / BigInt(1000000));
            
            const duration = (endEpochMillis - statrtEpochMillis) * 1000;
            const span_duration = Number(duration.toFixed(3));

            return {
                id: randomUUID(),
                name: span.name,
                kind: span.kind,
                status: span.status,
                status_message: span.statusMessage,
                trace_id: span.traceId,
                span_id: span.spanId,
                parent_span_id: span?.parentSpanId,
                attributes: span.attributes,
                events: span.events,
                service_name: span.serviceName,
                duration: span_duration,
                start_time: statrtEpochMillis,
                end_time: endEpochMillis,
                receive_timestamp: now,
                project_id
            };
        });

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.TRACING,
            format: "JSONEachRow",
            values: spans
        });

        return spans.length;
    }

    public async insertClickhouseBrowserPerformance({ projectId, payload }: { projectId: string, payload: BrowserPerfsPayloadEvent[] }) {
        const now = dayjs().unix();

        const perfs = payload.flatMap(item => item.performance.map(perf => {
            const health = perf.name && perf.value
                ? getHealthByValue(perf.name as VitalsEnum, perf.value as number)
                : undefined;

            return {
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
                project_id: projectId,
                health
            }
        }));

        await this.clickClient.insert({
            table: CLICKHOUSE_TABLE.PERFORMANCE,
            format: "JSONEachRow",
            values: perfs
        });

        return perfs.length;
    }
}