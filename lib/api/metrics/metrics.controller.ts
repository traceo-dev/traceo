import { Query } from "@nestjs/common";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthRequired } from "lib/common/decorators/auth-required.decorator";
import { MetricQueryDto } from "lib/common/types/dto/metrics.dto";
import { ApiResponse } from "lib/common/types/dto/response.dto";
import { IMetric, MetricsResponse } from "lib/common/types/interfaces/metrics.interface";
import { MetricsQueryService } from "./query/metrics-query.service";

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
    constructor(
        private readonly metricsQueryService: MetricsQueryService
    ) { }

    @Get('/:id')
    @AuthRequired()
    async getMetrics(
        @Param('id') id: string
    ): Promise<ApiResponse<IMetric[]>> {
        return await this.metricsQueryService.getApplicationMetrics(id);
    }

    @Get('/:id/datasource')
    @AuthRequired()
    async getMetricValues(
        @Param("id") id: string,
        @Query() query: MetricQueryDto
    ): Promise<ApiResponse<MetricsResponse[]>> {
        return await this.metricsQueryService.getMetricData(id, query);
    }
}