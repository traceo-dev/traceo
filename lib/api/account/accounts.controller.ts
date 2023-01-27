import {
    Controller,
    Get,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'lib/common/decorators/auth-guard.decorator';
import { BaseDtoQuery } from '../../common/base/query/base-query.model';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { IAccount } from '../../common/types/interfaces/account.interface';
import { AccountQueryService } from './account-query/account-query.service';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(new AuthGuard())
export class AccountsController {
    constructor(
        readonly accountQueryService: AccountQueryService,
    ) { }

    @Get()
    @AuthRequired()
    async getApplication(@Query("id") id: string): Promise<ApiResponse<IAccount>> {
        return await this.accountQueryService.getApiDto(id);
    }

    @Get('/search')
    @AuthRequired()
    async getAccounts(@Query() query: BaseDtoQuery): Promise<ApiResponse<IAccount[]>> {
        return await this.accountQueryService.getApiListDto(query);
    }
}
