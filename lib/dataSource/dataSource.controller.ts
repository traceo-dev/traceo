import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfluxDS } from '../db/entities/influxds.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { MetricsQueryDto, MetricsResponse } from '../types/tsdb';
import { DataSourceService } from './dataSource.service';

@ApiTags('datasource')
@Controller('datasource')
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService
    ) { }

    @Get()
    @AuthRequired()
    public async getDataSource(@Query("id") id: number): Promise<InfluxDS> {
        return await this.dsService.getConnectedDataSource(id);
    }

    @Get("/metrics")
    @AuthRequired()
    public async getMetrics(@Query() query: MetricsQueryDto): Promise<MetricsResponse[]> {
        return await this.dsService.getMetrics(query);
    }

    @Delete()
    @AuthRequired()
    public async removeDataSource(@Query("id") id: number): Promise<void> {
        return await this.dsService.removeDataSource(id);
    }
}
