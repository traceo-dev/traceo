import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { features } from "process";
import { Environment, Release } from "src/db/documents/release";
import { WorkspaceStatistics } from "src/db/models/statistics";
import { COLLECTION, MONGODB_CONNECTION } from "src/db/mongodb.module";
import { mongoDbUtils } from "src/helpers/mongodb";

@Injectable()
export class StatisticsQueryService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private readonly db: Db
    ) { }

    async getWorkspaceStatistics(appId: string, env: Environment = 'dev'): Promise<WorkspaceStatistics> {
        const releaseInfoQuery = await this.db.collection(COLLECTION.RELEASES).find({
            appId,
            env
        }).sort({ createdAt: -1 }).toArray();
        const releases = mongoDbUtils.getDocuments<Release>(releaseInfoQuery);

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