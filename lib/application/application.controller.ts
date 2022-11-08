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
import { AccountPermissionService } from 'lib/account/account-permission/account-permission.service';
import { RequestUser } from '../auth/auth.model';
import { BaseDtoQuery } from '../core/query/generic.model';
import { Application } from '../db/entities/application.entity';
import { Log } from '../db/entities/log.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { AuthAccount } from '../libs/decorators/auth-user.decorator';
import { ApplicationQueryService } from './application-query/application-query.service';
import { CreateApplicationBody, ApplicationBody } from './application.model';
import { ApplicationService } from './application.service';

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
    @Query() query: { id: number },
  ) {
    return await this.applicationQueryService.getApplicationRuntime(query.id);
  }

  @Get('/logs')
  @AuthRequired()
  async getApplicationLogs(
    @Query() query: { id: number, startDate: number, endDate: number },
  ): Promise<Log[]> {
    return await this.applicationQueryService.getApplicationLogs({ ...query });
  }

  @Post()
  @AuthRequired()
  async createApplication(
    @Body() body: CreateApplicationBody,
    @AuthAccount() account: RequestUser,
  ): Promise<Application> {
    await this.permission.can('CREATE_APP', account);

    return await this.applicationService.createApplication(body, account);
  }

  @Patch()
  @AuthRequired()
  async updateApplication(
    @Body() body: ApplicationBody,
    @AuthAccount() account: RequestUser,
  ): Promise<void> {
    await this.permission.can('UPDATE_APP', account);

    return await this.applicationService.updateApplication(body, account);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteApplication(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<void> {
    await this.permission.can('DELETE_APP', account);

    return await this.applicationService.deleteApplication(id);
  }
}
