import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseDtoQuery } from '@common/base/query/base-query.model';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IApplication } from '@traceo/types';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';


@ApiTags('applications')
@Controller('applications')
@UseGuards(new AuthGuard())
export class ApplicationsController {
    constructor(
        readonly applicationService: ApplicationService,
        readonly applicationQueryService: ApplicationQueryService
    ) { }

    @Get()
    async getApplication(@Query("id") id: string): Promise<ApiResponse<IApplication>> {
        return await this.applicationQueryService.getApiDto(id);
    }

    @Get('/search')
    async getApplications(@Query() query: BaseDtoQuery): Promise<ApiResponse<IApplication[]>> {
        return await this.applicationQueryService.getApiListDto(query);
    }
}
