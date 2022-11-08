import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountPermissionService } from 'lib/account/account-permission/account-permission.service';
import { RequestUser } from 'lib/auth/auth.model';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import { AuthRequired } from '../../libs/decorators/auth-required.decorator';
import { DataSourceConnStatus } from '../../types/tsdb';
import { InfluxConfigurationBody } from './influx.model';
import { InfluxService } from './influx.service';

@ApiTags('influx')
@Controller('influx')
export class InfluxController {
    constructor(
        private readonly influxService: InfluxService,
        private readonly permission: AccountPermissionService
    ) { }

    @Post('/config')
    @AuthRequired()
    async saveInfluxDataSource(
        @Body() body: InfluxConfigurationBody,
        @AuthAccount() account: RequestUser
    ): Promise<DataSourceConnStatus> {
        await this.permission.can('UPDATE_DATASOURCE', account);

        return await this.influxService.saveInfluxDataSource(body);
    }
}
