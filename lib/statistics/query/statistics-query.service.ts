import { Injectable, Logger } from "@nestjs/common";

import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "../../db/entities/incident.entity";
import { AppIncidentsStats } from "../../../lib/types/interfaces/statistics.interface";
import { ErrorDetails } from "../../../lib/types/interfaces/incident.interface";
import { ApiResponse } from "../../../lib/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../../lib/helpers/constants";

@Injectable()
export class StatisticsQueryService {
  private logger: Logger;
  constructor(private entityManger: EntityManager) {
    this.logger = new Logger(StatisticsQueryService.name);
  }

  async getApplicationStatistics(
    id: string
  ): Promise<ApiResponse<AppIncidentsStats>> {
    const minDateBefore = dayjs().subtract(7, "day").unix();

    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.application_id = :id", { id })
        .andWhere("incident.last_error > :date", { date: minDateBefore })
        .orderBy("incident.created_at", "DESC", "NULLS LAST")
        .select(["incident.errorsDetails"])
        .getMany();

      const errorsDetails: ErrorDetails[] = incidents.reduce(
        (acc, curr) => acc.concat(curr.errorsDetails),
        [],
      );

      const lastWeekCount =
        errorsDetails?.filter((o) => dayjs(o?.date).isAfter(minDateBefore))?.length ||
        0;

      return new ApiResponse("success", undefined, { lastWeekCount });
    } catch (error) {
      this.logger.error(`[${this.getApplicationStatistics.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getTodayErrors(
    applicationId: string
  ): Promise<ApiResponse<ErrorDetails[]>> {
    const today = dayjs().startOf("day").utc().unix();

    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.application_id = :applicationId", { applicationId })
        .andWhere("incident.last_error > :today", { today })
        .select(["incident.errorsDetails"])
        .getMany();

      const cachedDates: ErrorDetails[] = incidents.reduce(
        (acc, curr) => acc.concat(curr.errorsDetails),
        [],
      );

      const resp = cachedDates.filter((d) => dayjs.unix(d.date).utc().isToday());

      return new ApiResponse("success", undefined, resp);
    } catch (error) {
      this.logger.error(`[${this.getTodayErrors.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getTotalOverview(
    appId: string
  ): Promise<ApiResponse<ErrorDetails[]>> {
    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.application_id = :appId", { appId })
        .select("incident.errorsDetails")
        .getMany();

      const errorsDetails: ErrorDetails[] = incidents.reduce(
        (acc, curr) => acc.concat(curr.errorsDetails),
        [],
      );
      return new ApiResponse("success", undefined, errorsDetails);
    } catch (error) {
      this.logger.error(`[${this.getTotalOverview.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
