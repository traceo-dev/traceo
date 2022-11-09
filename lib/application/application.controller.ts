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
import { Application } from '../db/entities/application.entity';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { ApplicationQueryService } from './application-query/application-query.service';
import { ApplicationService } from './application.service';
import { ApplicationLogsQuery, ILog } from '../../lib/types/interfaces/log.interface';
import { IApplication } from '../../lib/types/interfaces/application.interface';

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
  async getApplication(@Query("id") id: number): Promise<IApplication> {
    return await this.applicationQueryService.getDto(id);
  }

  @Get('/all')
  @AuthRequired()
  async getApplications(@Query() query: BaseDtoQuery): Promise<IApplication[]> {
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
    @Query() query: ApplicationLogsQuery,
  ): Promise<ILog[]> {
    return await this.applicationQueryService.getApplicationLogs({ ...query });
  }

  @Post()
  @AuthRequired()
  async createApplication(
    @Body() body: CreateApplicationDto,
    @AuthAccount() account: RequestUser,
  ): Promise<IApplication> {
    await this.permission.can('CREATE_APP', account);

    return await this.applicationService.createApplication(body, account);
  }

  @Patch()
  @AuthRequired()
  async updateApplication(
    @Body() body: ApplicationDto,
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
