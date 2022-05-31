import { Injectable } from "@nestjs/common";
import { Environment } from "src/db/models/release";
import { Release } from "src/db/entities/release.entity";
import { HourlyStatistic, WorkspaceStatistics } from "src/db/models/statistics";
import { EntityManager } from "typeorm";
import dayjs from "dayjs";
import { Incident } from "src/db/entities/incident.entity";
import { OccurrDate } from "src/db/models/incident";

@Injectable()
export class StatisticsQueryService {
    constructor(
        private entityManger: EntityManager
    ) { }

    /**
     * TO REFACTORING
     */
    async getWorkspaceStatistics(id: string, env: Environment = 'dev'): Promise<WorkspaceStatistics> {
        const releases = await this.entityManger.getRepository(Release)
            .createQueryBuilder('release')
            .where('release.workspaceId = :id', { id })
            .andWhere('release.env = :env', { env })
            .orderBy('release.createdAt', 'DESC')
            .getMany();

        const lastRelease = releases[0];

        const { totalIncidentsCount, totalIncidentsOccurCount } = releases.reduce((acc, item) => {
            acc.totalIncidentsCount += item.incidentsCount;
            acc.totalIncidentsOccurCount += item.incidentsOccurCount;

            return acc;
        }, { totalIncidentsCount: 0, totalIncidentsOccurCount: 0 })

        return {
            total: {
                incidentsCount: totalIncidentsCount,
                incidentsOccurCount: totalIncidentsOccurCount,
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
                hour: `${i}:00`,
                count: count || 0
            })
        }

        return {
            count: totalCount,
            data: response
        };
    }

    public async getTotalOverview(workspaceId: string): Promise<any> {
        // const cachedDates: OccurrDate[] = [];
        // const maxDate = dayjs().subtract(7, 'day').startOf('day').unix();

        // await this.entityManger.getRepository(Incident)
        //     .createQueryBuilder('incident')
        //     .where("incident.workspace.id = :workspaceId", { workspaceId })
        //     .where("incident.lastOccur > :today", { maxDate })
        //     .select('incident.occurDates')
        //     .getMany()
        //     .then((response) => {
        //         response.forEach((incident) => {
        //             cachedDates.push(...incident.occurDates)
        //         })
        //     });

        // const datesToStats = cachedDates.filter((o) => dayjs.unix(o.date).isAfter(maxDate));
    }
}