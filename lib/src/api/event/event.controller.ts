import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IEvent } from "@traceo/types";
import { EventQueryService } from "./query/event-query.service";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { Query, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("event")
@Controller("event")
@UseGuards(new AuthGuard())
export class EventController {
  constructor(private readonly eventQueryService: EventQueryService) {}

  @Get("/incident")
  async getEventsForIncident(@Query("id") id: string): Promise<ApiResponse<IEvent[]>> {
    return await this.eventQueryService.getEventsForIncident(id);
  }

  // @Get('/project/:id/grouped')
  // async getGroupedEventsForProject(
  //     @Param("id") id: string
  // ): Promise<ApiResponse<IEvent[]>> {
  //     return await this.eventQueryService.getGroupedEventsForProject(id);
  // }

  // incident analytics

  @Get("/graph/incident-daily")
  async getTodayEventsForIncidentGraph(@Query("id") id: string): Promise<ApiResponse<IEvent[]>> {
    return await this.eventQueryService.getTodayEventsForIncidentGraph(id);
  }

  @Get("/graph/incident-overview")
  async getOverviewEventsForIncidentGraph(
    @Query("id") id: string
  ): Promise<ApiResponse<IEvent[]>> {
    return await this.eventQueryService.getOverviewEventsForIncidentGraph(id);
  }

  // overview dashboard

  // @Get("/graph/project-daily")
  // async getDailyOverview(@Query("id") id: string): Promise<ApiResponse<unknown>> {
  //     return await this.eventQueryService.getTodayEventsGraph(id);
  // }

  // @Get("/graph/project-overview")
  // async getTotalOverview(@Query("id") id: string): Promise<ApiResponse<unknown>> {
  //     return await this.eventQueryService.getTotalOverviewGraph(id);
  // }
}
