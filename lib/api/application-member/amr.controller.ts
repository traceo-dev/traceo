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
import { BaseDtoQuery } from '../../common/base/query/base-query.model';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { AuthAccount } from '../../common/decorators/auth-user.decorator';
import { AddAccountToApplicationDto, UpdateAmrDto } from '../../common/types/dto/amr.dto';
import { ApplicationDtoQuery } from '../../common/types/dto/application.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { RequestUser } from '../../common/types/interfaces/account.interface';
import { IAmr } from '../../common/types/interfaces/amr.interface';
import { IApplicationResponse } from '../../common/types/interfaces/application.interface';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AmrService } from './amr.service';

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
