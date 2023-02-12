import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IInfluxConfigDto, DataSourceConnStatus } from '@traceo/types';
import { DataSourceService } from './dataSource.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';
import { BaseDataSourceDto } from '@common/types/dto/data-source';

@ApiTags('datasource')
@Controller('datasource')
@UseGuards(new AuthGuard())
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService
    ) { }

    @Get()
    public async getDataSource(@Query("id") id: string): Promise<ApiResponse<IInfluxConfigDto>> {
        return await this.dsService.getDatasource(id);
    }

    @Get('/heartbeat')
    async checkConnection(
        @Query('id') id: string
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        return await this.dsService.heartbeat(id);
    }

    @Post('/save')
    async saveDatasource(
        @Body() body: BaseDataSourceDto
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        return await this.dsService.saveDatasource(body);
    }

    @Delete()
    public async removeDataSource(
        @Query("id") id: string
    ): Promise<ApiResponse<unknown>> {
        return await this.dsService.removeDataSource(id);
    }
}
