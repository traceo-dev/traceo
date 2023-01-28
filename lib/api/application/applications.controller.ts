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
import { GuardsService } from '@common/guards/guards.service';
import { AuthAccount } from '@common/decorators/auth-user.decorator';
import { CreateApplicationDto, ApplicationDto } from '@common/types/dto/application.dto';
import { ApiResponse } from '@common/types/dto/response.dto';
import { RequestUser } from '@common/types/interfaces/account.interface';
import { IApplication } from '@common/types/interfaces/application.interface';
import { ApplicationLogsQuery, ILog } from '@common/types/interfaces/log.interface';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';


@ApiTags('applications')
@Controller('applications')
@UseGuards(new AuthGuard())
export class ApplicationsController {
    constructor(
        readonly applicationService: ApplicationService,
        readonly applicationQueryService: ApplicationQueryService,
        readonly permission: GuardsService
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
