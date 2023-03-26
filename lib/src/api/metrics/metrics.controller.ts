import { Query } from "@nestjs/common";
import { Controller, Get, Param } from "@nestjs/common";
import { Body, Patch, UseGuards } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import {
  MetricQueryDto,
  MetricsQueryDto,
  UpdateMetricDto
} from "../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IMetric, MetricPreviewType, MetricResponseType } from "@traceo/types";
import { MetricsService } from "./metrics.service";
import { MetricsQueryService } from "./query/metrics-query.service";

@ApiTags("metrics")
@Controller("metrics")
@UseGuards(new AuthGuard())
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly metricsQueryService: MetricsQueryService
  ) {}

  @Get("/:id")
  async getMetrics(
    @Param("id") id: string,
    @Query() query: MetricsQueryDto
  ): Promise<ApiResponse<IMetric[]>> {
    return await this.metricsQueryService.getApplicationMetrics(id, query);
  }

  @Get("/:id/preview/:metricId")
  async getApplicationMetricPreviewData(
    @Param("id") id: string,
    @Param("metricId") metricId: string,
    @Query("from") from: number,
    @Query("to") to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
    return await this.metricsQueryService.getApplicationMetricPreviewData(id, metricId, from, to);
  }

  @Get("/:id/datasource")
  async getMetricValues(
    @Param("id") appId: string,
    @Query() query: MetricQueryDto
  ): Promise<ApiResponse<MetricResponseType[]>> {
    return await this.metricsQueryService.getMetricData(appId, query);
  }

  @Patch("/:metricId/update")
  async updateMetric(
    @Param("metricId") metricId: string,
    @Body() body: UpdateMetricDto
  ): Promise<ApiResponse<string>> {
    return await this.metricsService.updateMetric(metricId, body);
  }
}
