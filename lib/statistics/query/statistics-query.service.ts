import { Injectable } from "@nestjs/common";
import {
  PlotData,
  AppIncidentsStats
} from "../../types/statistics";
import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "../../db/entities/incident.entity";
import { ErrorDetails } from "../../types/incident";

@Injectable()
export class StatisticsQueryService {
  constructor(private entityManger: EntityManager) { }

  async getApplicationStatistics(
    id: string
  ): Promise<AppIncidentsStats> {
    try {
      const minDateBefore = dayjs().subtract(7, "day").unix();

      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.applicationId = :id", { id })
        .where("incident.lastError > :date", { date: minDateBefore })
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

      return {
        lastWeekCount
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getDailyOverview(
    applicationId: string
  ): Promise<{ count: number; data: PlotData[] }> {
    const today = dayjs().startOf("day").unix();

    const response: PlotData[] = [];

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

    const todayIncidents = cachedDates.filter((d) => dayjs.unix(d.date).isToday())

    let totalTodayIncidentsCount = 0;

    for (let i = 0; i <= 24; i++) {
      const count = todayIncidents.filter(
        (o) =>
          dayjs.unix(o.date).get("hour") === i
      )?.length;
      totalTodayIncidentsCount += count;
      response.push({
        date: dayjs().hour(i).startOf("h").unix(),
        count: count || 0
      });
    }

    return {
      count: totalTodayIncidentsCount,
      data: response
    };
  }

  public async getTotalOverview(
    appId: string
  ): Promise<PlotData[]> {
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
    return this.parseErrorDetails(errorsDetails);
  }

  public async getTotalOverviewForIncident(
    incidentId: string
  ): Promise<PlotData[]> {
    const incident = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.id = :incidentId", { incidentId })
      .select("incident.errorsDetails")
      .getOne();

    const errorsDetails = incident?.errorsDetails;

    return this.parseErrorDetails(errorsDetails);
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
      const formatted = dayjs.unix(currentDate).endOf("day").unix();
      const count = sortedDates?.filter(
        (a) => dayjs.unix(a?.date).endOf("day").unix() === formatted,
      ).length;
      response.push({
        date: currentDate,
        count: count || 0
      });
      currentDate = dayjs.unix(currentDate).add(1, "day").endOf("day").unix();
    }

    return response;
  }
}
