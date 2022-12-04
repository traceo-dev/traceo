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
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { AddAccountToApplicationDto, UpdateAmrDto } from '../../lib/types/dto/amr.dto';
import { ApplicationDtoQuery } from '../../lib/types/dto/application.dto';
import { IApplicationResponse } from '../../lib/types/interfaces/application.interface';
import { BaseDtoQuery } from '../core/query/generic.model';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AmrService } from './amr.service';
import { IAmr } from '../../lib/types/interfaces/amr.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('application-member-relationship')
@Controller('amr')
export class AmrController {
  constructor(
    private readonly amrService: AmrService,
    private readonly amrQueryService: AmrQueryService,
  ) { }

  @Get('/application')
  @AuthRequired()
  async getApplication(
    @Query('id') id: string,
    @AuthAccount() user: RequestUser,
  ): Promise<ApiResponse<IApplicationResponse>> {
    return await this.amrQueryService.getApplication(id, user);
  }

  @Get('/members')
  @AuthRequired()
  public async getApplicationMembers(
    @Query("id") id: string,
    @Query() query: BaseDtoQuery,
  ): Promise<ApiResponse<IAmr[]>> {
    return await this.amrQueryService.getApplicationMembers(id, query);
  }

  @Get('/applications')
  @AuthRequired()
  public async getAccountApplications(
    @Query() pageOptionsDto: ApplicationDtoQuery,
    @Query("accountId") accountId: string,
    @AuthAccount() user: RequestUser,
  ): Promise<ApiResponse<IAmr[]>> {
    return await this.amrQueryService.getApplicationsForAccount(
      accountId || user.id,
      pageOptionsDto
    );
  }

  @Post('/application/add')
  @AuthRequired()
  public async addAccountToApplication(
    @Body() body: AddAccountToApplicationDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.addAccountToApplication(body);
  }

  @Patch('/application/member')
  @AuthRequired()
  public async updateApplicationAccount(
    @Body() body: UpdateAmrDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.updateApplicationAccount(body);
  }

  @Delete('/application/member')
  @AuthRequired()
  public async removeAccountFromApplication(
    @Query("id", new ParseUUIDPipe()) id: string,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.removeAccountFromApplication(id);
  }
}
