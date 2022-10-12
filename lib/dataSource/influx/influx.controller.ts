import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
import { DataSourceConnStatus } from 'lib/types/tsdb';
import { InfluxConfigurationBody } from './influx.model';
import { InfluxService } from './influx.service';

@ApiTags('influx')
@Controller('influx')
export class InfluxController {
    constructor(
        private readonly influxService: InfluxService
    ) { }

    @Post('/config')
    @AuthRequired()
    async saveInfluxDataSource(
        @Body() body: InfluxConfigurationBody
    ): Promise<DataSourceConnStatus> {
        return await this.influxService.saveInfluxDataSource(body);
    }
}
