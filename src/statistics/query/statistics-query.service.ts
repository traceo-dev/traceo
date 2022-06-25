import { Injectable } from "@nestjs/common";
import { Environment } from "src/db/models/release";
import { Release } from "src/db/entities/release.entity";
import { HourlyStatistic, PlotData, WorkspaceStatistics } from "src/db/models/statistics";
import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "src/db/entities/incident.entity";
import { OccurrDate } from "src/db/models/incident";
import dateUtils from "src/helpers/dateUtils";

@Injectable()
export class StatisticsQueryService {
    constructor(
        private entityManger: EntityManager
    ) { }

    async getWorkspaceStatistics(id: string): Promise<WorkspaceStatistics> {
        const occurDates: OccurrDate[] = [];

        const incidents = await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.workspaceId = :id', { id })
            .orderBy('incident.createdAt', 'DESC')
            .select(['incident.occurDates', 'incident.occuredCount'])
            .getMany();

        const incidentsCount = incidents?.length || 0;
        const incidentsOccurCount = incidents?.reduce((acc, incident) => acc += incident?.occuredCount, 0);

        incidents.map((incident) => occurDates.push(...incident.occurDates));

        const minDateBefore = dayjs().subtract(7, 'day').unix();
        const lastWeekIncidentsCount = occurDates?.filter((o) => dayjs(o.date).isAfter(minDateBefore))?.length || 0;

        const maxDateBefore = dayjs().subtract(14, 'day').unix();

        const twoWeeksAgoIncidentsCount = occurDates?.filter((o) => dayjs(o.date).isBetween(minDateBefore, maxDateBefore))?.length || 0;
        const { isMore, percentage } = this.calculatePercentageDiff(lastWeekIncidentsCount, twoWeeksAgoIncidentsCount);

        const releases = await this.entityManger.getRepository(Release)
            .createQueryBuilder('release')
            .where('release.workspaceId = :id', { id })
            .orderBy('release.createdAt', 'DESC')
            .getMany();

        const lastRelease = releases[0];

        return {
            total: {
                incidentsCount,
                incidentsOccurCount,
                lastWeek: lastWeekIncidentsCount,
                percentage,
                isMore
            },
            release: {
                version: lastRelease?.version,
                incidentsCount: lastRelease?.incidentsCount | 0,
                incidentsOccurCount: lastRelease?.incidentsOccurCount | 0,
            }
        };
    }

    public async getDailyOverview(workspaceId: string): Promise<{ count: number, data: HourlyStatistic[] }> {
        const today = dayjs().startOf('day').unix();
        let totalCount: number = 0;

        const response: HourlyStatistic[] = [];
        const cachedDates: OccurrDate[] = [];

        await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .where("incident.workspaceId = :workspaceId", { workspaceId })
            .andWhere("incident.lastOccur > :today", { today })
            .select('incident.occurDates')
            .getMany()
            .then((response) => {
                response.forEach((incident) => {
                    incident.occurDates.forEach((occur) => {
                        if (dayjs(occur.date).isAfter(today)) {
                            cachedDates.push(occur);
                        }
                    })
                })
            });

        for (let i = 0; i <= 23; i++) {
            const count = cachedDates.filter((o) => ((dayjs.unix(o.date).get('hour') === i) && (dayjs.unix(o.date).isAfter(today))))?.length;
            totalCount += count;
            response.push({
                date: dayjs().hour(i).startOf('h').unix(),
                count: count || 0
            })
        }

        return {
            count: totalCount,
            data: response
        };
    }

    public async getTotalOverview(workspaceId: string, range: number = 2): Promise<PlotData[]> {
        const occurDates: OccurrDate[] = [];

        await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .where("incident.workspaceId = :workspaceId", { workspaceId })
            .select('incident.occurDates')
            .getMany()
            .then((response) => {
                response.forEach((incident) => {
                    occurDates.push(...incident.occurDates);
                })
            });

        //for case when eq. is new workspace without any incidents we return mocked data from past 7 days
        //because plot need some data to properly rendering
        if (occurDates?.length === 0) {
            const mock: PlotData[] = [];
            for (let i=0; i < 7; i++) {
                const mockedDate = dayjs().subtract(7, 'day').unix();
                mock.push({
                    date: mockedDate,
                    count: 0
                });
            }

            return mock;
        }

        return this.parseOccurDatesToPlotData(occurDates, range);
    }

    public async getTotalOverviewForIncident(incidentId: string, range: number = 2): Promise<PlotData[]> {
        const incident = await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .where("incident.id = :incidentId", { incidentId })
            .select('incident.occurDates')
            .getOne();

        const occurDates = incident?.occurDates;

        return this.parseOccurDatesToPlotData(occurDates, range);
    }

    protected parseOccurDatesToPlotData(occurDates: OccurrDate[], range: number): PlotData[] {
        const sortedDates = occurDates?.sort((a, b) => a.date - b.date);
        const beginDate = occurDates[0];

        const response: PlotData[] = [];

        let currentDate = dayjs
            .unix(beginDate?.date)
            .subtract(range + 1, "day")
            .endOf("day")
            .unix();
        const endDate = dayjs().endOf("day").unix();

        if (currentDate === endDate) {
            return response;
        }

        while (currentDate <= endDate) {
            const formatted = dayjs.unix(currentDate).endOf("day").unix();
            const count = sortedDates?.filter(
                (a) => dayjs.unix(a?.date).endOf("day").unix() === formatted
            ).length;
            response.push({
                date: currentDate,
                count: count || 0
            });
            currentDate = dayjs.unix(currentDate).add(1, "day").endOf("day").unix();
        }

        return response;
    }

    protected calculatePercentageDiff(one: number, two: number): { percentage: string, isMore: boolean } {
        if (two === 0 && one !== 0) {
            return { percentage: "100%", isMore: true };
        } else if (one === 0 && two === 0) {
            return { percentage: "0%", isMore: false };
        } else {
            const res = ((one / two) * 100) - 100;
            return {
                percentage: `${res.toFixed(1)}%`,
                isMore: res > 0 ? true : false
            }
        }
    }
}