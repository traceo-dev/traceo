import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppIncidentsStats, ErrorDetails } from "@traceo/types";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { StatisticsQueryService } from "./query/statistics-query.service";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("statistics")
@Controller("statistics")
@UseGuards(new AuthGuard())
export class StatisticsController {
  constructor(private readonly statisticsQueryService: StatisticsQueryService) {}

  @Get()
  async getApplicationStatistics(
    @Query("id") id: string
  ): Promise<ApiResponse<AppIncidentsStats>> {
    return await this.statisticsQueryService.getApplicationStatistics(id);
  }

  @Get("/daily")
  async getDailyOverview(@Query("id") id: string): Promise<ApiResponse<ErrorDetails[]>> {
    return await this.statisticsQueryService.getTodayErrors(id);
  }

  @Get("/total")
  async getTotalOverview(@Query("id") id: string): Promise<ApiResponse<ErrorDetails[]>> {
    return await this.statisticsQueryService.getTotalOverview(id);
  }
}
