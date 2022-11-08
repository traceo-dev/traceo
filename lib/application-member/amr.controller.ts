import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../auth/auth.model';
import { BaseDtoQuery } from '../core/query/generic.model';
import { AccountMemberRelationship } from '../db/entities/account-member-relationship.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { AuthAccount } from '../libs/decorators/auth-user.decorator';
import { ApplicationResponse } from '../types/application';
import { AmrQueryService } from './amr-query/amr-query.service';
import {
  AddAccountToApplicationModel,
  UpdateAmrModel,
  ApplicationDtoQuery
} from './amr.model';
import { AmrService } from './amr.service';

@ApiTags('application-member-relationship')
@Controller('amr')
export class AmrController {
  constructor(
    private readonly amrService: AmrService,
    private readonly amrQueryService: AmrQueryService,
  ) {}

  @Get('/application')
  @AuthRequired()
  async getApplication(
    @Query('id') id: number,
    @AuthAccount() user: RequestUser,
  ): Promise<ApplicationResponse | null> {
    return await this.amrQueryService.getApplication(id, user);
  }

  @Get('/members')
  @AuthRequired()
  public async getApplicationMembers(
    @Query("id") id: number,
    @Query() query: BaseDtoQuery,
  ): Promise<AccountMemberRelationship[]> {
    return await this.amrQueryService.getApplicationMembers(id, query);
  }

  @Get('/applications')
  @AuthRequired()
  public async getAccountApplications(
    @Query() pageOptionsDto: ApplicationDtoQuery,
    @Query("accountId") accountId: string,
    @AuthAccount() user: RequestUser,
  ): Promise<AccountMemberRelationship[]> {
    return await this.amrQueryService.getApplicationsForAccount(
      accountId || user.id,
      pageOptionsDto
    );
  }

  @Post('/application/add')
  @AuthRequired()
  public async addAccountToApplication(
    @Body() body: AddAccountToApplicationModel,
  ): Promise<void> {
    return await this.amrService.addAccountToApplication(body);
  }

  @Patch('/application/member')
  @AuthRequired()
  public async updateApplicationAccount(
    @Body() body: UpdateAmrModel,
  ): Promise<void> {
    return await this.amrService.updateApplicationAccount(body);
  }

  @Delete('/application/member')
  @AuthRequired()
  public async removeAccountFromApplication(
    @Query("id", new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.amrService.removeAccountFromApplication(id);
  }

  @Delete('/application/leave')
  @AuthRequired()
  public async leaveApplication(
    @Query("aid", new ParseUUIDPipe()) aid: string,
    @Query("appId") appId: number,
  ): Promise<void> {
    return await this.amrService.leaveApplication(aid, appId);
  }
}
