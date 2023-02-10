import {
    Controller,
    Get,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';
import { BaseDtoQuery } from '@common/base/query/base-query.model';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IUser } from '@traceo/types';
import { AccountQueryService } from './account-query/account-query.service';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(new AuthGuard())
export class AccountsController {
    constructor(
        readonly accountQueryService: AccountQueryService,
    ) { }

    @Get()
    async getAccount(@Query("id") id: string): Promise<ApiResponse<IUser>> {
        return await this.accountQueryService.getApiDto(id);
    }

    @Get('/search')
    async getAccounts(@Query() query: BaseDtoQuery): Promise<ApiResponse<IUser[]>> {
        return await this.accountQueryService.getApiListDto(query);
    }
}
