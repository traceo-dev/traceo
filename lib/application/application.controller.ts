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
import { RequestUser } from 'lib/auth/auth.model';
import { BaseDtoQuery, Environment } from 'lib/core/generic.model';
import { Application } from 'lib/db/entities/application.entity';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import { TraceoLog } from 'lib/types/logs';
import { ApplicationQueryService } from './application-query/application-query.service';
import { CreateApplicationBody, ApplicationBody, ApplicationLogsQuery } from './application.model';
import { ApplicationService } from './application.service';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(
    readonly applicationService: ApplicationService,
    readonly applicationQueryService: ApplicationQueryService,
  ) { }

  @Get()
  @AuthRequired()
  async getApplication(@Query("id") id: number): Promise<Application> {
    return await this.applicationQueryService.getDto(id);
  }

  @Get('/all')
  @AuthRequired()
  async getApplications(@Query() query: BaseDtoQuery): Promise<Application[]> {
    return await this.applicationQueryService.listDto(query);
  }

  @Get('/runtime')
  @AuthRequired()
  async getApplicationRuntimeConfiguration(
    @Query() query: { id: number, env: Environment },
  ) {
    return await this.applicationQueryService.getApplicationRuntime(query.id, query.env);
  }

  @Get('/logs')
  @AuthRequired()
  async getApplicationLogs(
    @Query() query: { id: number, env: Environment, startDate: number, endDate: number },
  ): Promise<TraceoLog[]> {
    return await this.applicationQueryService.getApplicationLogs({ ...query });
  }

  @Post()
  @AuthRequired()
  async createApplication(
    @Body() body: CreateApplicationBody,
    @AuthAccount() account: RequestUser,
  ): Promise<Application> {
    return await this.applicationService.createApplication(body, account);
  }

  @Patch()
  @AuthRequired()
  async updateApplication(
    @Body() body: ApplicationBody,
    @AuthAccount() account: RequestUser,
  ): Promise<void> {
    return await this.applicationService.updateApplication(body, account);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteApplication(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<void> {
    return await this.applicationService.deleteApplication(id, account);
  }
}
