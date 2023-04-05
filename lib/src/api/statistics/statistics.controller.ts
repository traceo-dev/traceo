import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IEvent } from "@traceo/types";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { StatisticsQueryService } from "./query/statistics-query.service";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("statistics")
@Controller("statistics")
@UseGuards(new AuthGuard())
export class StatisticsController {
  constructor(private readonly statisticsQueryService: StatisticsQueryService) { }

  @Get("/daily")
  async getDailyOverview(@Query("id") id: string): Promise<ApiResponse<IEvent[]>> {
    return await this.statisticsQueryService.getTodayEvents(id);
  }

  @Get("/total")
  async getTotalOverview(@Query("id") id: string): Promise<ApiResponse<IEvent[]>> {
    return await this.statisticsQueryService.getTotalOverview(id);
  }
}
