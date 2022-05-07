import { Injectable } from "@nestjs/common";
import { Environment } from "src/db/models/release";
import { Release } from "src/db/entities/release.entity";
import { WorkspaceStatistics } from "src/db/models/statistics";
import { EntityManager } from "typeorm";

@Injectable()
export class StatisticsQueryService {
    constructor(
        private entityManger: EntityManager
    ) { }

    async getWorkspaceStatistics(id: string, env: Environment = 'dev'): Promise<WorkspaceStatistics> {
        const releases = await this.entityManger.getRepository(Release).find({
            where: {
                workspace: {
                    id
                },
                env
            },
            order: {
                createdAt: 'DESC'
            }
        })
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
}