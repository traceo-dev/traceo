import { Injectable, Logger } from "@nestjs/common";

import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { ErrorDetails } from "@traceo/types";

@Injectable()
export class StatisticsQueryService {
  private logger: Logger;
  constructor(private entityManger: EntityManager) {
    this.logger = new Logger(StatisticsQueryService.name);
  }

  public async getTodayEvents(projectId: string): Promise<ApiResponse<ErrorDetails[]>> {
    const today = dayjs().startOf("day").utc().unix();

    try {
      const result = await this.entityManger.query(`
        SELECT date
        FROM event
        WHERE project_id = $1
        AND date >= $2
      `, [projectId, today])

      return new ApiResponse("success", undefined, result);
    } catch (error) {
      this.logger.error(`[${this.getTodayEvents.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getTotalOverview(projectId: string): Promise<
    ApiResponse<{
      errors: ErrorDetails[];
    }>
  > {
    try {
      const result = await this.entityManger.query(`
        SELECT date
        FROM event
        WHERE project_id = $1
      `, [projectId])

      return new ApiResponse("success", undefined, {
        errors: result
      });
    } catch (error) {
      this.logger.error(`[${this.getTotalOverview.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
