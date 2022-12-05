import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationDto, CreateApplicationDto } from '../../lib/types/dto/application.dto';
import { AccountPermissionService } from '../../lib/account/account-permission/account-permission.service';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { BaseDtoQuery } from '../core/query/generic.model';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';
import { ApplicationLogsQuery, ILog } from '../../lib/types/interfaces/log.interface';
import { IApplication } from '../../lib/types/interfaces/application.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(
    readonly applicationService: ApplicationService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly permission: AccountPermissionService
  ) { }

  @Get()
  @AuthRequired()
  async getApplication(@Query("id") id: string): Promise<ApiResponse<IApplication>> {
    return await this.applicationQueryService.getApiDto(id);
  }

  @Get('/all')
  @AuthRequired()
  async getApplications(@Query() query: BaseDtoQuery): Promise<ApiResponse<IApplication[]>> {
    return await this.applicationQueryService.getApiListDto(query);
  }

  @Get('/logs')
  @AuthRequired()
  async getApplicationLogs(
    @Query() query: ApplicationLogsQuery,
  ): Promise<ApiResponse<ILog[]>> {
    return await this.applicationQueryService.getApplicationLogs({ ...query });
  }

  @Post()
  @AuthRequired()
  async createApplication(
    @Body() body: CreateApplicationDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<IApplication>> {
    await this.permission.can('CREATE_APP', account);

    return await this.applicationService.create(body, account);
  }

  @Patch()
  @AuthRequired()
  async updateApplication(
    @Body() body: ApplicationDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('UPDATE_APP', account, body.id);

    return await this.applicationService.updateApplication(body);
  }

  @Post('/api-key/generate/:id')
  @AuthRequired()
  async generateApiKey(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('GENERATE_API_KEY', account, id);

    return await this.applicationService.generateApiKey(id, account);
  }

  @Delete('/api-key/remove/:id')
  @AuthRequired()
  async removeApiKey(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('REMOVE_API_KEY', account, id);

    return await this.applicationService.removeApiKey(id);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteApplication(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE_APP', account);

    return await this.applicationService.delete(id);
  }
}
