import { Inject, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Order, PageableDto, PageOptionsDto } from "src/core/core.model";
import { CoreService } from "src/core/core.service";
import { Incident } from "src/db/documents/incident";
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

    async getIncidents(workspaceId: string, pagination: PageOptionsDto): Promise<PageableDto<Incident>> {
        const { skip, order, take } = pagination;
        const incidentsQuery = 
            await this.db
                .collection(COLLECTION.INCIDENTS)
                .find({
                    projectId: workspaceId
                })
                .project({ traces: 0, stack: 0, requestData: 0 }) //omit this value while fetching data
                .sort({ createdAt: order === Order.DESC ? -1 : 1 })
                .limit(take)
                .skip(skip)
                .toArray();

        return this.preparePageableMongo<Incident>(incidentsQuery, pagination);
    }
}