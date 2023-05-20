import { Injectable } from "@nestjs/common";
import { ClickHouseClient, ClickHouseClientConfigOptions, createClient, QueryParams } from "@clickhouse/client";
import { ILog, MetricPayload, PerformanceQuery, Performance, Notification, Span } from "@traceo/types";
import { MetricQueryDto } from "../../../common/types/dto/metrics.dto";
import { QueryTracingDto } from "src/common/types/dto/tracing";
import { LogsQuery } from "src/common/types/dto/logs.dto";

@Injectable()
export class ClickhouseService {
    private readonly configs: ClickHouseClientConfigOptions;
    private client: ClickHouseClient;

    constructor(configs: ClickHouseClientConfigOptions) {
        this.configs = configs;
    }

    public async connect() {
        this.client = createClient(this.configs);
    }

    public async query(params: QueryParams) {
        return await this.client.query(params)
    }

    public async loadMetric(
        projectId: string,
        query: MetricQueryDto
    ): Promise<MetricPayload[]> {
        const metrics = await this.query({
            query: `
                SELECT name, value, timestamp FROM metrics
                WHERE project_id = '${projectId}'
                AND name IN (${query.fields.map((e) => `'${e}'`)})
                AND timestamp >= ${query.from}
                AND timestamp <= ${query.to}
                ORDER BY timestamp ASC
            `,
            format: "JSONEachRow"
        });

        return metrics.json<MetricPayload[]>()
    }

    public async loadLogs(query: LogsQuery): Promise<ILog[]> {
        const logs = await this.query({
            query: `
              SELECT * FROM logs 
              WHERE project_id = '${query.projectId}'
              AND precise_timestamp >= ${query.from}
              AND precise_timestamp <= ${query.to}
              AND level IN (${query.levels.map((e) => `'${e}'`)})
              ORDER BY precise_timestamp DESC
              LIMIT ${query?.take || 250}`,
            format: "JSONEachRow"
        });

        return logs.json<ILog[]>();
    }

    public async loadGraphLogs(query: LogsQuery): Promise<ILog[]> {
        const logs = await this.query({
            query: `
              SELECT precise_timestamp, level FROM logs 
              WHERE project_id = '${query.projectId}'
              AND precise_timestamp >= ${query.from}
              AND precise_timestamp <= ${query.to}
              AND level IN (${query.levels.map((e) => `'${e}'`)})
              ORDER BY precise_timestamp DESC`,
            format: "JSONEachRow"
        });

        return logs.json<ILog[]>();
    }

    public async loadPermormance(projectId: string, query: PerformanceQuery): Promise<Performance[]> {
        const from = query.from;
        const to = query.to;
        const names = query.fields.map((e) => `'${e}'`);
        const healths = query.health ? `'${query.health}'` : `'good', 'need_improvement', 'poor'`;

        let sqlQuery = `
            SELECT * FROM performance
            WHERE project_id = '${projectId}'
            AND timestamp >= ${from}
            AND timestamp <= ${to}
            AND name in (${names})
            AND health in (${healths})
        `;

        if (query.search) {
            const search = query.search.toLowerCase();
            sqlQuery += `AND (multiSearchAny(lower(browser_name), ['${search}'])`;
            sqlQuery += `OR multiSearchAny(lower(platform_type), ['${search}'])`;
            sqlQuery += `OR multiSearchAny(lower(view), ['${search}']))`;
        }

        sqlQuery += 'ORDER BY receive_timestamp DESC';

        const perfs = await this.query({
            query: sqlQuery,
            format: "JSONEachRow"
        });

        return perfs.json<Performance[]>();
    }

    public async loadUserNotifications(userId: string): Promise<Notification[]> {
        const sqlQuery = `
            SELECT * FROM notifications WHERE user_id = '${userId}'
            ORDER BY timestamp DESC
        `;

        const notifications = await this.query({
            query: sqlQuery,
            format: "JSONEachRow"
        });

        return notifications.json<Notification[]>();
    }

    public async loadTracingServiceNames(projectId: string): Promise<{ service_name: string }[]> {
        const sqlQuery = `
            SELECT DISTINCT service_name
            FROM tracing
            WHERE project_id = '${projectId}'
            AND parent_span_id = ''
        `;

        const serviceNames = await this.query({
            query: sqlQuery,
            format: "JSONEachRow"
        });

        return serviceNames.json();
    }

    public async loadSpansNames(projectId: string): Promise<{ name: string }[]> {
        const sqlQuery = `
            SELECT DISTINCT name
            FROM tracing
            WHERE project_id = '${projectId}'
            AND parent_span_id = ''
        `;

        const serviceNames = await this.query({
            query: sqlQuery,
            format: "JSONEachRow"
        });

        return serviceNames.json();
    }

    public async loadRootTraces(query: QueryTracingDto): Promise<Span[]> {
        let sqlQuery = `
            SELECT * FROM tracing
            WHERE project_id = '${query.projectId}'
            AND parent_span_id = ''
            AND toDateTime(receive_timestamp) > toDateTime(${query.from})
            AND toDateTime(receive_timestamp) < toDateTime(${query.to})
        `;

        if (query?.serviceName) {
            sqlQuery += `AND service_name = '${query.serviceName}'\n`
        }

        if (query?.spanName) {
            sqlQuery += `AND name = '${query.spanName}'\n`
        }

        if (query?.traceStatus) {
            sqlQuery += `AND status = '${query.traceStatus}'\n`
        }

        if (query?.traceKind) {
            sqlQuery += `AND kind = ${query.traceKind}\n`
        }

        if (query?.durationMax) {
            sqlQuery += `AND duration <= ${query.durationMax}\n`
        }

        if (query?.durationMin) {
            sqlQuery += `AND duration => ${query.durationMin}\n`
        }

        const search = query?.search;
        if (search) {
            sqlQuery += `AND (multiSearchAny(lower(trace_id), ['${search}'])`;
            sqlQuery += `OR multiSearchAny(lower(span_id), ['${search}'])`;
            sqlQuery += `OR multiSearchAny(lower(service_name), ['${search}'])`;
            sqlQuery += `OR multiSearchAny(lower(name), ['${search}']))`;
        }

        sqlQuery += 'ORDER BY receive_timestamp DESC\n';
        sqlQuery += `LIMIT ${query?.take || 100}`;

        const spans = await this.query({
            query: sqlQuery,
            format: "JSONEachRow"
        });

        const resp = await spans.json<Span[]>();
        return resp;
    }
}