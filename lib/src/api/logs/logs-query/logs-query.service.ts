import { Injectable, Logger } from "@nestjs/common";
import { ILog, LogLevel, PlotData } from "@traceo/types";
import dayjs from "dayjs";
import { INTERNAL_SERVER_ERROR } from "src/common/helpers/constants";
import { ClickhouseService } from "src/common/services/clickhouse/clickhouse.service";
import { LogsQuery } from "src/common/types/dto/logs.dto";
import { ApiResponse } from "src/common/types/dto/response.dto";

type LogsResponseType = {
    logs: ILog[],
}

type GraphResposnseType = {
    graph: [number, number][]
}

@Injectable()
export class LogsQueryService {
    private logger: Logger;

    constructor(
        private readonly clickhouseClient: ClickhouseService
    ) {
        this.logger = new Logger(LogsQueryService.name);
    }

    public async getProjectLogs(query: LogsQuery): Promise<ApiResponse<LogsResponseType>> {
        if (!query.levels || query.levels.length === 0) {
            return new ApiResponse("success", undefined, []);
        }

        try {
            const selectedFields = ["message", "timestamp"]
            const logs = await this.clickhouseClient.loadLogs(selectedFields, query);

            return new ApiResponse("success", undefined, {
                logs,
            });
        } catch (error) {
            this.logger.error(`[${this.getProjectLogs.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }

    public async getLogsGraphPayload(query: LogsQuery): Promise<ApiResponse<GraphResposnseType>> {
        try {
            const selectedFields = ["precise_timestamp"]
            const logs = await this.clickhouseClient.loadLogs(selectedFields, query);

            const graph = await this.parseLogGraphData(query, logs);

            return new ApiResponse("success", undefined, {
                graph
            });
        } catch (error) {
            this.logger.error(`[${this.getProjectLogs.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Calculating interval between next values on xAxis in graph
     */
    private calculateInterval(query: LogsQuery): number {
        const { from, to } = query;
        const diff = dayjs.unix(to).diff(dayjs.unix(from), "hour");

        if (diff < 48) {
            return 1;
        }

        if (diff > 48 && diff < 96) {
            return 5;
        }

        return 15;
    }

    private async parseLogGraphData(query: LogsQuery, logs: ILog[] = []): Promise<[number, number][]> {
        let date = query.from;
        const endPlotDate = query.to;

        const xAxis: [number, number][] = [];

        while (date <= endPlotDate) {
            const interval = this.calculateInterval(query)

            const isBetween = (d: number) => dayjs.unix(d).isBetween(dayjs.unix(date), dayjs.unix(date).subtract(interval, "minutes"))
            const logsInRange = logs.filter(({ precise_timestamp }) => isBetween(precise_timestamp)) ?? [];

            date = dayjs.unix(date).add(interval, "minute").unix();

            xAxis.push([date, logsInRange.length]);
        }

        return xAxis;
    }
}
