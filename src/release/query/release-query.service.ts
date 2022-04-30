import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { Order, PageOptionsDto } from "src/core/core.model";
import { Release } from "src/db/documents/release";
import { COLLECTION, MONGODB_CONNECTION } from "src/db/mongodb.module";
import { mongoDbUtils } from "src/helpers/mongodb";

@Injectable()
export class ReleaseQueryService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private readonly db: Db
    ) { }

    private prepareTextSearchFields = (): string[] => {
        return ["version", "env", "versionSetter"]
    }

    private createTextSearch = (search: string) => {
        const result = [];
        const fields = this.prepareTextSearchFields();
        fields.map((f) => {
            result.push({
                [f]: new RegExp('.*' + (search || "") + '.*', 'i')
            });
        });

        return result;
    }

    public async getReleases(appId: string, pagination: PageOptionsDto): Promise<Release[]> {
        const { skip, order, take, search, sortBy } = pagination;

        const releasesQuery =
            await this.db
                .collection(COLLECTION.RELEASES)
                .find({
                    appId,
                    $or: [
                        ...this.createTextSearch(search)
                    ]
                })
                .project({ traces: 0, stack: 0, requestData: 0, comments: 0 })
                .sort(sortBy, order === Order.DESC ? -1 : 1)
                .limit(take)
                .skip(skip)
                .toArray();

        const releases = mongoDbUtils.getDocuments<Release>(releasesQuery);
        return releases;
    }
}