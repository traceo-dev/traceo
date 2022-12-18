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
import { BaseDtoQuery } from '../../common/base/query/base-query.model';
import { GuardsService } from '../../common/guards/guards.service';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { AuthAccount } from '../../common/decorators/auth-user.decorator';
import { CreateApplicationDto, ApplicationDto } from '../../common/types/dto/application.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { RequestUser } from '../../common/types/interfaces/account.interface';
import { IApplication } from '../../common/types/interfaces/application.interface';
import { ApplicationLogsQuery, ILog } from '../../common/types/interfaces/log.interface';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';


@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(
    readonly applicationService: ApplicationService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly permission: GuardsService
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
