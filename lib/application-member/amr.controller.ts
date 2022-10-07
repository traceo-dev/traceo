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
import { RequestUser } from 'lib/auth/auth.model';
import { BaseDtoQuery } from 'lib/core/generic.model';
import { AccountMemberRelationship } from 'lib/db/entities/account-member-relationship.entity';
import { Account } from 'lib/db/entities/account.entity';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import { ApplicationResponse } from 'lib/types/application';
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
    private readonly awrService: AmrService,
    private readonly awrQueryService: AmrQueryService,
  ) {}

  @Get('/account')
  @AuthRequired()
  async getAccountById(@Query("id") id: string): Promise<Account> {
    return await this.awrQueryService.getAccount(id);
  }

  @Get('/application')
  @AuthRequired()
  async getApplication(
    @Query('id') id: number,
    @AuthAccount() user: RequestUser,
  ): Promise<ApplicationResponse | null> {
    return await this.awrQueryService.getApplication(id, user);
  }

  @Get('/members')
  @AuthRequired()
  public async getApplicationMembers(
    @Query("id") id: number,
    @Query() query: BaseDtoQuery,
  ): Promise<AccountMemberRelationship[]> {
    return await this.awrQueryService.getApplicationMembers(id, query);
  }

  @Get('/applications')
  @AuthRequired()
  public async getAccountApplications(
    @Query() pageOptionsDto: ApplicationDtoQuery,
    @Query("accountId") accountId: string,
    @AuthAccount() user: RequestUser,
  ): Promise<AccountMemberRelationship[]> {
    return await this.awrQueryService.getApplicationsForAccount(
      accountId || user.id,
      pageOptionsDto
    );
  }

  @Post('/application/add')
  @AuthRequired()
  public async addAccountToApplication(
    @Body() body: AddAccountToApplicationModel,
  ): Promise<void> {
    return await this.awrService.addAccountToApplication(body);
  }

  @Patch('/application/member')
  @AuthRequired()
  public async updateApplicationAccount(
    @Body() body: UpdateAmrModel,
  ): Promise<void> {
    return await this.awrService.updateApplicationAccount(body);
  }

  @Delete('/application/member')
  @AuthRequired()
  public async removeAccountFromApplication(
    @Query("id", new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.awrService.removeAccountFromApplication(id);
  }

  @Delete('/application/leave')
  @AuthRequired()
  public async leaveApplication(
    @Query("aid", new ParseUUIDPipe()) aid: string,
    @Query("appId") appId: number,
  ): Promise<void> {
    return await this.awrService.leaveApplication(aid, appId);
  }
}
