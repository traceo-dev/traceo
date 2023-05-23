import { Injectable, Logger } from "@nestjs/common";
import { ILog } from "@traceo/types";
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
        try {
            const selectedFields = ["message", "precise_timestamp"]
            const logs = await this.clickhouseClient.loadLogs(selectedFields, query);

            return new ApiResponse("success", undefined, {
                logs,
            });
        } catch (error) {
            this.logger.error(`[${this.getProjectLogs.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Calculating interval between next values on xAxis in graph.
     * Response is an count of seconds.
     */
    private calculateInterval(query: LogsQuery): number {
        const { from, to } = query;

        const hoursDiff = dayjs.unix(to).diff(dayjs.unix(from), "hour");
        const minutesDiff = dayjs.unix(to).diff(dayjs.unix(from), "minutes");

        const HOURS_IN_DAY = 24;
        const ONE_SECOND = 1;
        const SECONDS_IN_MINUTE = ONE_SECOND * 60;

        // FROM START TO 24H
        if (minutesDiff >= 0 && minutesDiff <= 60 * 12) {
            return SECONDS_IN_MINUTE;
        }

        // BETWEEN 24H and 23H
        if (minutesDiff > 60 * 12 && hoursDiff < HOURS_IN_DAY) {
            return SECONDS_IN_MINUTE * 2;
        }

        // BETWEEN 1D and 2D
        if (hoursDiff > HOURS_IN_DAY && hoursDiff < HOURS_IN_DAY * 2) {
            return SECONDS_IN_MINUTE * 5;
        }

        // BETWEEN 2D and 3D
        if (hoursDiff > HOURS_IN_DAY * 2 && hoursDiff < HOURS_IN_DAY * 3) {
            return SECONDS_IN_MINUTE * 10;
        }

        // BETWEEN 3D and 4D
        if (hoursDiff > HOURS_IN_DAY * 3 && hoursDiff < HOURS_IN_DAY * 4) {
            return SECONDS_IN_MINUTE * 15;
        }

        // BETWEEN 4D and 5D
        if (hoursDiff > HOURS_IN_DAY * 4 && hoursDiff < HOURS_IN_DAY * 5) {
            return SECONDS_IN_MINUTE * 20;
        }

        // ABOVE 5D
        return SECONDS_IN_MINUTE * 30;
    }

    public async getLogsGraphPayload(query: LogsQuery): Promise<ApiResponse<GraphResposnseType>> {
        try {
            const logs = await this.clickhouseClient.loadLogsTimeSeries(query, this.calculateInterval(query));

            // Mapping should be also in clickhouse query
            const graph = logs.map((e) => [e.minute, e.count]);

            return new ApiResponse("success", undefined, {
                graph
            });
        } catch (error) {
            this.logger.error(`[${this.getProjectLogs.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }
}
