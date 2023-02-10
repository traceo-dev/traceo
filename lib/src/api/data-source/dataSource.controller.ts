import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IInfluxConfigDto, DataSourceConnStatus } from '@traceo/types';
import { DataSourceService } from './dataSource.service';
import { InfluxConfigurationDto } from '@common/types/dto/influx.dto';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';

@ApiTags('datasource')
@Controller('datasource')
@UseGuards(new AuthGuard())
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService
    ) { }

    @Get()
    public async getDataSource(@Query("id") id: string): Promise<ApiResponse<IInfluxConfigDto>> {
        return await this.dsService.getConnectedDataSource(id);
    }

    @Get('/connection/check')
    async checkConnection(
        @Query('id') id: string
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        return await this.dsService.checkConnection(id);
    }

    @Post('/config')
    async saveInfluxDataSource(
        @Body() body: InfluxConfigurationDto
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        return await this.dsService.saveDataSource(body);
    }

    @Delete()
    public async removeDataSource(
        @Query("id") id: string
    ): Promise<ApiResponse<unknown>> {
        return await this.dsService.removeDataSource(id);
    }
}
