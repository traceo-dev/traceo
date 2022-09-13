import { Injectable } from "@nestjs/common";
import {
  DashboardStats,
  HourlyStats,
  PlotData,
  AppStats
} from "src/types/statistics";
import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "src/db/entities/incident.entity";
import { RequestUser } from "src/auth/auth.model";
import { Application } from "src/db/entities/application.entity";
import { Environment } from "src/core/generic.model";
import { ErrorDetails } from "src/types/incident";

@Injectable()
export class StatisticsQueryService {
  constructor(private entityManger: EntityManager) {}

  async getApplicationStatistics(
    id: string,
    env: Environment,
  ): Promise<AppStats> {
    const incidents = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.applicationId = :id", { id })
      .andWhere("incident.env = :env", { env })
      .orderBy("incident.createdAt", "DESC")
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
  }

  public async getDailyOverview(
    applicationId: string,
    environment: Environment,
  ): Promise<{ count: number; data: HourlyStats[] }> {
    const today = dayjs().startOf("day").unix();

    const response: HourlyStats[] = [];

    const incidents = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.applicationId = :applicationId", { applicationId })
      .andWhere("incident.env = :environment", { environment })
      .andWhere("incident.lastOccur > :today", { today })
      .select(["incident.occurDates", "incident.occuredCount"])
      .getMany();

    const cachedDates: ErrorDetails[] = incidents.reduce(
      (acc, curr) => acc.concat(curr.occurDates),
      [],
    );
    const count = incidents?.reduce((acc, val) => (acc += val.occuredCount), 0);

    for (let i = 0; i <= 24; i++) {
      const count = cachedDates.filter(
        (o) =>
          dayjs.unix(o.date).get("hour") === i &&
          dayjs.unix(o.date).isAfter(today),
      )?.length;
      response.push({
        date: dayjs().hour(i).startOf("h").unix(),
        count: count || 0
      });
    }

    return {
      count,
      data: response
    };
  }

  public async getTotalOverview(
    appId: string,
    environment: Environment,
  ): Promise<PlotData[]> {
    const incidents = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.applicationId = :appId", { appId })
      .andWhere("incident.env = :environment", { environment })
      .select("incident.occurDates")
      .getMany();

    const occurDates: ErrorDetails[] = incidents.reduce(
      (acc, curr) => acc.concat(curr.occurDates),
      [],
    );
    return this.parseOccurDatesToPlotData(occurDates);
  }

  public async getTotalOverviewForIncident(
    incidentId: string,
    env: Environment,
  ): Promise<PlotData[]> {
    const incident = await this.entityManger
      .getRepository(Incident)
      .createQueryBuilder("incident")
      .where("incident.id = :incidentId", { incidentId })
      .andWhere("incident.env = :env", { env })
      .select("incident.occurDates")
      .getOne();

    const occurDates = incident?.occurDates;

    return this.parseOccurDatesToPlotData(occurDates);
  }

  protected parseOccurDatesToPlotData(occurDates: ErrorDetails[]): PlotData[] {
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
