import {
    Controller,
    Get,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/decorators/auth-guard.decorator';
import { BaseDtoQuery } from '../../common/base/query/base-query.model';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { IUser } from '@traceo/types';
import { UserQueryService } from './user-query/user-query.service';

@ApiTags('users')
@Controller('users')
@UseGuards(new AuthGuard())
export class UsersController {
    constructor(
        readonly queryService: UserQueryService,
    ) { }

    @Get()
    async getUser(@Query("id") id: string): Promise<ApiResponse<IUser>> {
        return await this.queryService.getApiDto(id);
    }

    @Get('/search')
    async getUsers(@Query() query: BaseDtoQuery): Promise<ApiResponse<IUser[]>> {
        return await this.queryService.getApiListDto(query);
    }
}
