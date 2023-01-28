import { Injectable, Logger } from "@nestjs/common";

import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { INTERNAL_SERVER_ERROR } from "@common/helpers/constants";
import { Incident } from "@db/entities/incident.entity";
import { ApiResponse } from "@common/types/dto/response.dto";
import { AppIncidentsStats, PieData } from "@common/types/interfaces/statistics.interface";
import { ErrorDetails } from "@common/types/interfaces/incident.interface";

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
  ): Promise<ApiResponse<{
    errors: ErrorDetails[],
    pie: PieData[]
  }>> {
    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.application_id = :appId", { appId })
        .select(["incident.errorsDetails", "incident.type", "incident.status", "incident.id"])
        .getMany();

      const errorsDetails: ErrorDetails[] = incidents.reduce((acc, curr) => acc.concat(curr.errorsDetails), []);
      const pieData = this.parseIncidentsToPieChart(incidents);

      return new ApiResponse("success", undefined, {
        errors: errorsDetails,
        pie: pieData
      });
    } catch (error) {
      this.logger.error(`[${this.getTotalOverview.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  private parseIncidentsToPieChart(incidents: Incident[]): PieData[] {
    const result = incidents.map(({ type, errorsDetails, status, id }) => ({
      name: type,
      value: errorsDetails ? errorsDetails.length : 0,
      status,
      id
    }));

    return result.sort((a, b) => b.value - a.value);
  }
}
