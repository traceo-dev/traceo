import { Injectable, Logger } from "@nestjs/common";
import { ILog } from "@traceo/types";
import dayjs from "dayjs";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { LogsQuery } from "../../../common/types/dto/logs.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { calculateInterval } from "src/common/helpers/interval";

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

    public async getLogsGraphPayload(query: LogsQuery): Promise<ApiResponse<GraphResposnseType>> {
        try {
            const interval = calculateInterval({
                from: query.from,
                to: query.to
            });
            const logs = await this.clickhouseClient.loadLogsTimeSeries(query, interval);

            // TODO: Mapping should be also in clickhouse query
            const time = logs.map((e) => e.minute);
            const count = logs.map((e) => e.count);

            return new ApiResponse("success", undefined, {
                graph: [time, count]
            });
        } catch (error) {
            this.logger.error(`[${this.getLogsGraphPayload.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }
}
