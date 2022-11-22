import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../../../lib/types/interfaces/account.interface';
import { AccountPermissionService } from '../../../lib/account/account-permission/account-permission.service';
import { AuthAccount } from '../../../lib/helpers/decorators/auth-user.decorator';
import { DataSourceConnStatus } from '../../../lib/types/interfaces/tsdb.interface';
import { AuthRequired } from '../../helpers/decorators/auth-required.decorator';
import { InfluxService } from './influx.service';
import { InfluxConfigurationDto } from '../../../lib/types/dto/influx.dto';
import { ApiResponse } from '../../../lib/types/dto/response.dto';

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
        @Body() body: InfluxConfigurationDto,
        @AuthAccount() account: RequestUser
    ): Promise<ApiResponse<DataSourceConnStatus>> {
        // await this.permission.can('UPDATE_DATASOURCE', account);

        return await this.influxService.saveInfluxDataSource(body);
    }
}
