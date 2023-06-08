import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { Span } from '@traceo/types';
import { QueryTracingDto } from '../../common/types/dto/tracing';
import { TracingQueryService } from './tracing-query/tracing-query.service';

@Controller('tracing')
@ApiTags('tracing')
export class TracingController {
    constructor(
        private readonly tracingQueryService: TracingQueryService
    ) { }

    @Get()
    async getRootTraces(
        @Query() body: QueryTracingDto
    ): Promise<ApiResponse<Span[]>> {
        return await this.tracingQueryService.getRootTraces(body);
    }

    @Get("/parent/:id")
    async getSpansByTraceId(
        @Param("id") id: string
    ): Promise<ApiResponse<Span[]>> {
        return await this.tracingQueryService.getSpansByTraceId(id);
    }

    @Get("/services/:id")
    async getServiceNames(
        @Param("id") id: string
    ): Promise<ApiResponse<any>> {
        return await this.tracingQueryService.getServiceNames(id);
    }

    @Get("/spans/:id")
    async getSpanNames(
        @Param("id") id: string
    ): Promise<ApiResponse<any>> {
        return await this.tracingQueryService.getSpansNames(id);
    }
}
