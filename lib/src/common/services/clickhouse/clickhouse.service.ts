import { Injectable } from "@nestjs/common";
import { ClickHouseClient, ClickHouseClientConfigOptions, createClient, QueryParams } from "@clickhouse/client";
import { LogsQuery, ILog } from "@traceo/types";

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

    public async loadLogs(query: LogsQuery): Promise<ILog[]> {
        const logs = await this.client.query({
            query: `
              SELECT * FROM logs 
              WHERE application_id = '${query.id}'
              AND precise_timestamp >= ${query.from}
              AND precise_timestamp <= ${query.to}
              AND level IN (${query.levels.map((e) => `'${e}'`)})
              ORDER BY precise_timestamp DESC`,
            format: "JSONEachRow"
        });

        return logs.json<ILog[]>();
    }
}