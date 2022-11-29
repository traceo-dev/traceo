import { Injectable, Logger } from "@nestjs/common";

import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "../../db/entities/incident.entity";
import dateUtils from "../../../lib/helpers/dateUtils";
import { AppIncidentsStats, DailyOverview, PlotData } from "../../../lib/types/interfaces/statistics.interface";
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
        .where("incident.applicationId = :id", { id })
        .andWhere("incident.lastError > :date", { date: minDateBefore })
        .orderBy("incident.createdAt", "DESC", "NULLS LAST")
        .select(["incident.errorsDetails", "incident.errorsCount"])
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
        .where("incident.applicationId = :applicationId", { applicationId })
        .andWhere("incident.lastError > :today", { today })
        .select(["incident.errorsDetails", "incident.errorsCount"])
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
  ): Promise<ApiResponse<PlotData[]>> {
    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.applicationId = :appId", { appId })
        .select("incident.errorsDetails")
        .getMany();

      const errorsDetails: ErrorDetails[] = incidents.reduce(
        (acc, curr) => acc.concat(curr.errorsDetails),
        [],
      );
      const response = this.parseErrorDetails(errorsDetails);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getTotalOverview.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getTotalOverviewForIncident(
    incidentId: string
  ): Promise<ApiResponse<PlotData[]>> {
    try {
      const incident = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.id = :incidentId", { incidentId })
        .select("incident.errorsDetails")
        .getOne();

      const errorsDetails = incident?.errorsDetails;

      const response = this.parseErrorDetails(errorsDetails);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getTotalOverviewForIncident.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  protected parseErrorDetails(errorsDetails: ErrorDetails[]): PlotData[] {
    if (!errorsDetails || errorsDetails?.length === 0) {
      return [];
    }

    const sortedDates = errorsDetails?.sort((a, b) => a.date - b.date);
    const beginDate = errorsDetails[0];

    const response: PlotData[] = [];

    let currentDate = dayjs
      .unix(beginDate?.date)
      .subtract(3, "day")
      .endOf("day")
      .unix();
    const endDate = dayjs().endOf("day").unix();

    if (currentDate === endDate) {
      return response;
    }

    while (currentDate <= endDate) {
      const curr = dateUtils.getEndOf(currentDate);
      const count = sortedDates?.filter(({ date }) => dateUtils.getEndOf(date).unix() === curr.unix());
      response.push({
        date: currentDate,
        count: count.length || 0
      });
      currentDate = dayjs.unix(currentDate).add(1, "day").endOf("day").unix();
    }

    return response;
  }
}
