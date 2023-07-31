import { Query } from "@nestjs/common";
import { Controller, Get, Param } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import { ExploreMetricsQueryDto, MetricPanelDatasourceQueryDto } from "../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { DatasourceType, MetricsQueryService } from "./query/metrics-query.service";

@ApiTags("metrics")
@Controller("metrics")
@UseGuards(new AuthGuard())
export class MetricsController {
  constructor(private readonly metricsQueryService: MetricsQueryService) { }

  @Get("/:id/preview/:metricId")
  async getMetricGraph(
    @Param("id") id: string,
    @Param("metricId") metricId: string,
    @Query() query: MetricPanelDatasourceQueryDto
  ): Promise<ApiResponse<DatasourceType>> {
    return await this.metricsQueryService.getPanelGraphDatasource(id, metricId, query);
  }

  @Get("/:id/explore")
  async getMetricsExploreGraph(
    @Param("id") id: string,
    @Query() query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<DatasourceType>> {
    return await this.metricsQueryService.getExploreGraphDatasource(id, query);
  }

  @Get("/:id/raw-data")
  async getMetricsRawData(
    @Param("id") id: string,
    @Query() query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<DatasourceType>> {
    return await this.metricsQueryService.getPanelRawDataDatasource(id, query);
  }

  @Get("/fields/:id")
  async getMetricsFields(@Param("id") id: string): Promise<ApiResponse<DatasourceType>> {
    return await this.metricsQueryService.getDatasourceFields(id);
  }
}
