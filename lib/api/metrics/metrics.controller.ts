import { Query } from "@nestjs/common";
import { Controller, Get, Param } from "@nestjs/common";
import { Body, Patch } from "@nestjs/common/decorators";
import { ApiTags } from "@nestjs/swagger";
import { AuthRequired } from "lib/common/decorators/auth-required.decorator";
import { MetricQueryDto, UpdateMetricDto } from "lib/common/types/dto/metrics.dto";
import { ApiResponse } from "lib/common/types/dto/response.dto";
import { IMetric, MetricPreviewType, MetricsResponse } from "lib/common/types/interfaces/metrics.interface";
import { MetricsService } from "./metrics.service";
import { MetricsQueryService } from "./query/metrics-query.service";

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
    constructor(
        private readonly metricsService: MetricsService,
        private readonly metricsQueryService: MetricsQueryService
    ) { }

    @Get('/:id')
    @AuthRequired()
    async getMetrics(
        @Param('id') id: string
    ): Promise<ApiResponse<IMetric[]>> {
        return await this.metricsQueryService.getApplicationMetrics(id);
    }

    @Get('/:id/preview/:metricId')
    @AuthRequired()
    async getApplicationMetricPreviewData(
        @Param('id') id: string,
        @Param('metricId') metricId: string,
    ): Promise<ApiResponse<MetricPreviewType>> {
        return await this.metricsQueryService.getApplicationMetricPreviewData(id, metricId);
    }

    @Get('/:id/datasource')
    @AuthRequired()
    async getMetricValues(
        @Param("id") id: string,
        @Query() query: MetricQueryDto
    ): Promise<ApiResponse<MetricsResponse[]>> {
        return await this.metricsQueryService.getMetricData(id, query);
    }

    @Patch("/:metricId/update")
    @AuthRequired()
    async updateMetric(
        @Param('metricId') metricId: string,
        @Body() body: UpdateMetricDto
    ): Promise<ApiResponse<string>> {
        return await this.metricsService.updateMetric(metricId, body);
    }
}