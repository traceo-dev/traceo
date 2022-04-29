import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { map } from "rxjs";
import { Environment, Release, WorkspaceRelease } from "src/db/documents/release";
import { COLLECTION, MONGODB_CONNECTION } from "src/db/mongodb.module";
import { mongoDbUtils } from "src/helpers/mongodb";

@Injectable()
export class ReleaseQueryService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private readonly db: Db
    ) { }

    async getLastWorkspaceRelease(appId: string, env: Environment = 'dev'): Promise<Release> {
        const releaseInfoQuery = await this.db.collection(COLLECTION.RELEASES).find({
            appId,
            env
        }).sort({ createdAt: -1 }).limit(1).toArray();
        const releases = mongoDbUtils.getDocuments<Release>(releaseInfoQuery);
        const release = releases[0];

        return release;
    }

    // async getWorkspaceReleases(appId: string): Promise<Release[]> {

    // }
}