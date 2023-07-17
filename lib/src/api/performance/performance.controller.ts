import { Controller, Get, Param } from "@nestjs/common";
import { Query, UseGuards } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { PerformanceQuery, Performance, VitalsResponse } from "@traceo/types";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { PerformanceService } from "./performance.service";

@ApiTags("performance")
@Controller("performance")
@UseGuards(new AuthGuard())
export class PerformanceController {
  constructor(private readonly perfService: PerformanceService) {}

  @Get("/vitals/bins/:id")
  async getWebVitalsPerformanceBins(
    @Param("id") id: string,
    @Query() query: PerformanceQuery
  ): Promise<ApiResponse<VitalsResponse>> {
    return this.perfService.getPerformanceBins(id, query);
  }

  @Get("/vitals/:id")
  async getWebVitalsPerformance(
    @Param("id") id: string,
    @Query() query: PerformanceQuery
  ): Promise<ApiResponse<Performance[]>> {
    return this.perfService.getPerformanceList(id, query);
  }
}
