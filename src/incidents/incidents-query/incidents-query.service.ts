import { Inject, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Order, PageableDto } from "src/core/core.model";
import { CoreService } from "src/core/core.service";
import { Incident, IncidentSearchDto, IncidentStatusSearch } from "src/db/documents/incident";
import { COLLECTION, MONGODB_CONNECTION } from "src/db/mongodb.module";
import { mongoDbUtils } from "src/helpers/mongodb";
import { Db } from "typeorm";

@Injectable()
export class IncidentsQueryService extends CoreService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private db: Db,
    ) {
        super();
    }

    async getIncident(id: string): Promise<Incident | null> {
        const incidentQuery =
            await this.db
                .collection(COLLECTION.INCIDENTS)
                .findOne({
                    _id: new ObjectId(id)
                });
        const incident = mongoDbUtils.getDocument<Incident>(incidentQuery);
        return incident;
    }

    
    private prepareTextSearchFields = (): string[] => {
        return ["version", "status", "type", "message", "assigned.name"]
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

    async getIncidents(workspaceId: string, pagination: IncidentSearchDto): Promise<PageableDto<Incident>> {
        const { skip, order, take, search, status, sortBy } = pagination;

        const incidentsQuery =
            await this.db
                .collection(COLLECTION.INCIDENTS)
                .find({
                    projectId: workspaceId,
                    status: status === IncidentStatusSearch.ALL ? {
                        $ne: null
                    } : status,
                    $or: [
                        ...this.createTextSearch(search)
                    ]  
                })
                .project({ traces: 0, stack: 0, requestData: 0 })
                .sort(sortBy, order === Order.DESC ? -1 : 1)
                .limit(take)
                .skip(skip)
                .toArray();

        return this.preparePageableMongo<Incident>(incidentsQuery, pagination);
    }
}