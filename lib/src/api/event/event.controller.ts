import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IEvent } from '@traceo/types';
import { EventQueryService } from './query/event-query.service';
import { ApiResponse } from "../../common/types/dto/response.dto";

@ApiTags('event')
@Controller('event')
export class EventController {
    constructor(
        private readonly eventQueryService: EventQueryService
    ) { }

    @Get('/incident/:id')
    async getEventsForIncident(
        @Param("id") id: string
    ): Promise<ApiResponse<IEvent[]>> {
        return await this.eventQueryService.getEventsForIncident(id);
    }

    @Get('/incident/:id/grouped')
    async getGroupedEventsForIncident(
        @Param("id") id: string
    ): Promise<ApiResponse<IEvent[]>> {
        return await this.eventQueryService.getGroupedEventsForIncident(id);
    }

    @Get('/project/:id/grouped')
    async getGroupedEventsForProject(
        @Param("id") id: string
    ): Promise<ApiResponse<IEvent[]>> {
        return await this.eventQueryService.getGroupedEventsForProject(id);
    }
}
