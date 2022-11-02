import { Injectable, Logger } from "@nestjs/common";
import {
  DashboardStats,
  HourlyStats,
  PlotData,
  AppStats
} from "../../types/statistics";
import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "../../db/entities/incident.entity";
import { RequestUser } from "../../auth/auth.model";
import { Application } from "../../db/entities/application.entity";
import { ErrorDetails } from "../../types/incident";

@Injectable()
export class StatisticsQueryService {
  constructor(private entityManger: EntityManager) { }

  async getApplicationStatistics(
    id: string
  ): Promise<AppStats> {
    try {
      const incidents = await this.entityManger
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .where("incident.applicationId = :id", { id })
        .orderBy("incident.createdAt", "DESC", "NULLS LAST")
        .select(["incident.occurDates", "incident.occuredCount"])
        .getMany();

      const incidentsCount = incidents?.length || 0;
      const incidentsOccurCount = incidents?.reduce(
        (acc, incident) => (acc += incident?.occuredCount),
        0,
      );

      const occurDates: ErrorDetails[] = incidents.reduce(
        (acc, curr) => acc.concat(curr.occurDates),
        [],
      );

      const minDateBefore = dayjs().subtract(7, "day").unix();
      const lastWeekIncidentsCount =
        occurDates?.filter((o) => dayjs(o.date).isAfter(minDateBefore))?.length ||
        0;

      const total = {
        incidentsCount,
        incidentsOccurCount,
        lastWeek: lastWeekIncidentsCount
      };

      return {
        total
      };
    } catch (error) {
      Logger.error(error);
      throw new Error(error);
    }
  }

  public async getDailyOverview(
    applicationId: string
  ): Promise<{ count: number; data: HourlyStats[] }> {
    const today = dayjs().startOf("day").unix();

    const response: HourlyStats[] = [];

    const incidents = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.applicationId = :applicationId", { applicationId })
      .andWhere("incident.lastOccur > :today", { today })
      .select(["incident.occurDates", "incident.occuredCount"])
      .getMany();

    const cachedDates: ErrorDetails[] = incidents.reduce(
      (acc, curr) => acc.concat(curr.occurDates),
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
      .select("incident.occurDates")
      .getMany();

    const occurDates: ErrorDetails[] = incidents.reduce(
      (acc, curr) => acc.concat(curr.occurDates),
      [],
    );
    return this.parseOccurDatesToPlotData(occurDates);
  }

  public async getTotalOverviewForIncident(
    incidentId: string
  ): Promise<PlotData[]> {
    const incident = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.id = :incidentId", { incidentId })
      .select("incident.occurDates")
      .getOne();

    const occurDates = incident?.occurDates;

    return this.parseOccurDatesToPlotData(occurDates);
  }

  protected parseOccurDatesToPlotData(occurDates: ErrorDetails[]): PlotData[] {
    if (!occurDates || occurDates?.length === 0) {
      return [];
    }

    const sortedDates = occurDates?.sort((a, b) => a.date - b.date);
    const beginDate = occurDates[0];

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

  public async getDashboardOverviewStatistics(
    account: RequestUser,
  ): Promise<DashboardStats> {
    const { id } = account;

    return this.entityManger.transaction(async (manager) => {
      const ownerAppsCount = await manager
        .getRepository(Application)
        .createQueryBuilder("application")
        .innerJoin("application.owner", "owner", "owner.id = :id", { id })
        .getCount();

      const monthStart = dayjs().subtract(1, "month").startOf("day").unix();
      const incidents = await manager
        .getRepository(Incident)
        .createQueryBuilder("incident")
        .leftJoin("incident.application", "application")
        .innerJoin("application.owner", "owner", "owner.id = :id", { id })
        .andWhere("incident.createdAt > :than", { than: monthStart })
        .getCount();

      return {
        incidents,
        apps: {
          owner: ownerAppsCount
        }
      };
    });
  }
}
