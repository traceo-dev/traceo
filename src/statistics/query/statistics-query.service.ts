import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { map } from "rxjs";
import { Environment, Release, WorkspaceRelease } from "src/db/documents/release";
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

        console.log("RELEASE: ", lastRelease)

        let totalIncidentsCount: number = 0;
        let totalIncidentsOccurCount: number = 0;
        for (const release of releases) {
            totalIncidentsCount += release?.incidentsCount;
            totalIncidentsOccurCount += release?.incidentsOccurCount;
        }

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