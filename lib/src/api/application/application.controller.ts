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
import { RequestUser, IApplication, ILog, ApplicationLogsQuery } from '@traceo/types';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';


@ApiTags('application')
@Controller('application')
@UseGuards(new AuthGuard())
export class ApplicationController {
  constructor(
    readonly applicationService: ApplicationService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly permission: GuardsService
  ) { }

  @Get()
  async getApplication(@Query("id") id: string): Promise<ApiResponse<IApplication>> {
    return await this.applicationQueryService.getApiDto(id);
  }

  @Get('/all')
  async getApplications(@Query() query: BaseDtoQuery): Promise<ApiResponse<IApplication[]>> {
    return await this.applicationQueryService.getApiListDto(query);
  }

  @Get('/logs')
  async getApplicationLogs(
    @Query() query: ApplicationLogsQuery,
  ): Promise<ApiResponse<ILog[]>> {
    return await this.applicationQueryService.getApplicationLogs({ ...query });
  }

  @Post()
  async createApplication(@Body() body: CreateApplicationDto): Promise<ApiResponse<IApplication>> {
    // await this.permission.can('CREATE_APP', account);
    return await this.applicationService.create(body);
  }

  @Patch()
  async updateApplication(
    @Body() body: ApplicationDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('UPDATE_APP', account, body.id);

    return await this.applicationService.updateApplication(body);
  }

  @Post('/api-key/generate/:id')
  async generateApiKey(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('GENERATE_API_KEY', account, id);
    return await this.applicationService.generateApiKey(id);
  }

  @Delete('/api-key/remove/:id')
  async removeApiKey(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('REMOVE_API_KEY', account, id);
    return await this.applicationService.removeApiKey(id);
  }

  @Delete('/:id')
  public async deleteApplication(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE_APP', account);
    return await this.applicationService.delete(id);
  }
}
