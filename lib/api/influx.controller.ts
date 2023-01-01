import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from '../common/decorators/auth-required.decorator';
import { AuthAccount } from '../common/decorators/auth-user.decorator';
import { InfluxConfigurationDto } from '../common/types/dto/influx.dto';
import { ApiResponse } from '../common/types/dto/response.dto';
import { RequestUser } from '../common/types/interfaces/account.interface';
import { GuardsService } from '../common/guards/guards.service';
import { InfluxService } from '../providers/influx/influx.service';
import { DataSourceConnStatus } from '../common/types/interfaces/tsdb.interface';
import { Get, Query } from '@nestjs/common/decorators';

@ApiTags('influx')
@Controller('influx')
export class InfluxController {
    constructor(
        private readonly influxService: InfluxService,
        private readonly permission: GuardsService
    ) { }

    // TODO: move to metrics and remove this controller
    @Post('/config')
    @AuthRequired()
    async saveInfluxDataSource(
        @Body() body: InfluxConfigurationDto,
        @AuthAccount() account: RequestUser
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        // await this.permission.can('UPDATE_DATASOURCE', account);

        return await this.influxService.saveInfluxDataSource(body);
    }

    @Get('/connection/check')
    @AuthRequired()
    async checkConnection(
        @Query('id') id: string
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        return await this.influxService.checkConnection(id);
    }
}
