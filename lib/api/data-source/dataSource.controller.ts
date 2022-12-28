import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { AuthAccount } from '../../common/decorators/auth-user.decorator';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { RequestUser } from '../../common/types/interfaces/account.interface';
import { IInfluxDs } from '../../common/types/interfaces/influxds.interface';
import { GuardsService } from '../../common/guards/guards.service';
import { DataSourceService } from './dataSource.service';

@ApiTags('datasource')
@Controller('datasource')
export class DataSourceController {
    constructor(
        private readonly dsService: DataSourceService,
        private readonly permission: GuardsService
    ) { }

    @Get()
    @AuthRequired()
    public async getDataSource(@Query("id") id: string): Promise<ApiResponse<IInfluxDs>> {
        return await this.dsService.getConnectedDataSource(id);
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
