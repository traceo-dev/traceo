import { Injectable } from "@nestjs/common";
import { ClickHouseClient, ClickHouseClientConfigOptions, createClient, QueryParams } from "@clickhouse/client";
import { LogsQuery, ILog, TimeSerieMetric, PerformanceQuery, Performance, Notification } from "@traceo/types";
import { MetricQueryDto } from "../../../common/types/dto/metrics.dto";

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
    ): Promise<TimeSerieMetric[]> {
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

        return metrics.json<TimeSerieMetric[]>()
    }

    public async loadLogs(query: LogsQuery): Promise<ILog[]> {
        const logs = await this.query({
            query: `
              SELECT * FROM logs 
              WHERE project_id = '${query.id}'
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
}