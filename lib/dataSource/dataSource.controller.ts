import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountPermissionService } from 'lib/account/account-permission/account-permission.service';
import { RequestUser } from 'lib/auth/auth.model';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import { InfluxDS } from '../db/entities/influxds.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { MetricsQueryDto, MetricsResponse } from '../types/tsdb';
import { DataSourceService } from './dataSource.service';

@ApiTags('datasource')
@Controller('datasource')
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService,
        private readonly permission: AccountPermissionService
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
    public async removeDataSource(
        @Query("id") id: number,
        @AuthAccount() account: RequestUser,
    ): Promise<void> {
        await this.permission.can('REMOVE_DATASOURCE', account);

        return await this.dsService.removeDataSource(id);
    }
}
