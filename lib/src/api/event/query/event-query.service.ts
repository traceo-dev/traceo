import { Injectable } from "@nestjs/common/decorators";
import { Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { IEvent } from "@traceo/types";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";

@Injectable()
export class EventQueryService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManger: EntityManager
    ) {
        this.logger = new Logger(EventQueryService.name)
    }

    public async getEventsForIncident(incidentId: string): Promise<ApiResponse<IEvent[]>> {
        console.log("incident: ", incidentId)
        try {
            const result: IEvent[] = await this.entityManger.query(`
                SELECT * 
                FROM event 
                WHERE incident_id = $1
            `, [incidentId]);

            return new ApiResponse("success", undefined, result);
        } catch (error) {
            this.logger.error(`[${this.getEventsForIncident.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }
}