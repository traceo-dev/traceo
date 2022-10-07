import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfluxDS } from 'lib/db/entities/influxds.entity';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
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
        return await this.dsService.getDataSource(id);
    }

    @Delete()
    @AuthRequired()
    public async removeDataSource(@Query("id") id: number): Promise<void> {
        return await this.dsService.removeDataSource(id);
    }
}
