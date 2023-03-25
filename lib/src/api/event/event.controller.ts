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
    async getEventsForApp(
        @Param("id") id: string
    ): Promise<ApiResponse<IEvent[]>> {
        console.log("event alksjdn ===========  ==========")
        console.log("id: ", id)
        return await this.eventQueryService.getEventsForIncident(id);
    }
}
