import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfluxDS } from 'lib/db/entities/influxds.entity';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
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
    ): Promise<void> {
        return await this.influxService.saveInfluxDataSource(body);
    }
}
