import { Inject, Injectable } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { Incident, IncidentBatchUpdateDto, IncidentUpdateDto } from "src/db/documents/incident";
import { COLLECTION, MONGODB_CONNECTION } from "src/db/mongodb.module";

@Injectable()
export class IncidentsService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private db: Db
    ) { }

    async updateIncident(incidentId: string, update: IncidentUpdateDto): Promise<void> {
        await this.db.collection(COLLECTION.INCIDENTS).updateOne(
            {
                _id: new ObjectId(incidentId)
            },
            {
                $set: update
            }
        )
    }

    async updateBatchIncidents(update: IncidentBatchUpdateDto): Promise<void> {
        const { incidentsIds, ...rest } = update;

        try {
            const bulk = this.db.collection(COLLECTION.INCIDENTS).initializeOrderedBulkOp();
    
            incidentsIds?.map((id) => (
                bulk.find({
                    _id: new ObjectId(id)
                }).update({
                    $set: rest
                })
            ));
    
            bulk.execute();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}