import { Injectable } from "@nestjs/common";
import { ClickHouseClient, ClickHouseClientConfigOptions, createClient, QueryParams } from "@clickhouse/client";
import { LogsQuery, ILog, TimeSerieMetric } from "@traceo/types";
import { MetricQueryDto } from "src/common/types/dto/metrics.dto";

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
}