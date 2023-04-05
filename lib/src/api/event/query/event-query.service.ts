import { Injectable } from "@nestjs/common/decorators";
import { Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { IEvent, PlotData } from "@traceo/types";
import { Event } from "../../../db/entities/event.entity";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import dateUtils from "../../../common/helpers/dateUtils";
import dayjs from "dayjs";

@Injectable()
export class EventQueryService {
    private readonly logger: Logger;

    constructor(
        private readonly entityManger: EntityManager
    ) {
        this.logger = new Logger(EventQueryService.name)
    }

    public async getEventsForIncident(incidentId: string): Promise<ApiResponse<IEvent[]>> {
        try {
            const events = await this.entityManger.query(`SELECT * FROM event WHERE incident_id = '${incidentId}'`);
            return new ApiResponse("success", undefined, events);
        } catch (error) {
            this.logger.error(`[${this.getEventsForIncident.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }

    public async getGroupedEventsForIncident(incidentId: string): Promise<ApiResponse<any>> {
        try {
            const events = await this.entityManger.query(`SELECT id, date FROM event WHERE incident_id = '${incidentId}'`);
            const response = this.groupEventsByTime(events);

            return new ApiResponse("success", undefined, response);
        } catch (error) {
            this.logger.error(`[${this.getEventsForIncident.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Return events grouped by date for chart presentation
     * 
     * [{ date: [unix], count: [number] }]
     */
    private groupEventsByTime(events: Event[]) {
        const data: PlotData[] = [];

        if (!events) {
            return;
        }

        const sortedDates = events?.sort((a, b) => a?.date - b?.date);
        const beginDate = events[0];

        let currentDate = dateUtils.endOf(dayjs.unix(beginDate?.date).subtract(7, "day").unix());
        while (currentDate <= dateUtils.endOf()) {
            const currentErrors = sortedDates.filter(
                ({ date }) => dateUtils.endOf(date) === dateUtils.endOf(currentDate)
            );
            data.push({ date: dateUtils.endOf(currentDate), count: currentErrors?.length });
            currentDate = dateUtils.endOf(dayjs.unix(currentDate).add(1, "day").unix());
        }

        return data;
    }

    public async getGroupedEventsForProject(id: string): Promise<ApiResponse<PlotData[]>> {
        try {
            const events: Event[] = await this.entityManger.query(`SELECT * FROM event WHERE project_id = '${id}'`);
            const response = this.groupEventsByTime(events);

            return new ApiResponse("success", undefined, response);
        } catch (error) {
            this.logger.error(`[${this.getEventsForIncident.name}] Caused by: ${error}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR);
        }
    }
}