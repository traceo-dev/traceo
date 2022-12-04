import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { AccountPermissionService } from '../../lib/account/account-permission/account-permission.service';
import { AuthAccount } from '../../lib/helpers/decorators/auth-user.decorator';
import { MetricsQuery, MetricsResponse } from '../../lib/types/interfaces/metrics.interface';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { DataSourceService } from './dataSource.service';
import { IInfluxDs } from '../../lib/types/interfaces/influxds.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('datasource')
@Controller('datasource')
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService,
        private readonly permission: AccountPermissionService
    ) { }

    @Get()
    @AuthRequired()
    public async getDataSource(@Query("id") id: string): Promise<ApiResponse<IInfluxDs>> {
        return await this.dsService.getConnectedDataSource(id);
    }

    @Get("/metrics")
    @AuthRequired()
    public async getMetrics(@Query() query: MetricsQuery): Promise<ApiResponse<MetricsResponse[]>> {
        return await this.dsService.getMetrics(query);
    }

    @Delete()
    @AuthRequired()
    public async removeDataSource(
        @Query("id") id: string,
        @AuthAccount() account: RequestUser,
    ): Promise<ApiResponse<unknown>> {
        await this.permission.can('REMOVE_DATASOURCE', account);

        return await this.dsService.removeDataSource(id);
    }
}
