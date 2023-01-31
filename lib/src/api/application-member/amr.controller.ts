import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';
import { BaseDtoQuery } from '@common/base/query/base-query.model';
import { AddAccountToApplicationDto, UpdateAmrDto } from '@common/types/dto/amr.dto';
import { ApplicationDtoQuery } from '@common/types/dto/application.dto';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IAmr, IApplicationResponse } from '@traceo/types';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AmrService } from './amr.service';

@ApiTags('application-member-relationship')
@Controller('amr')
@UseGuards(new AuthGuard())
export class AmrController {
  constructor(
    private readonly amrService: AmrService,
    private readonly amrQueryService: AmrQueryService,
  ) { }

  @Get('/permission')
  async getPermission(
    @Query('id') id: string,
  ): Promise<ApiResponse<IApplicationResponse>> {
    return await this.amrQueryService.getPermission(id);
  }

  @Get('/members')
  public async getApplicationMembers(
    @Query("id") id: string,
    @Query() query: BaseDtoQuery,
  ): Promise<ApiResponse<IAmr[]>> {
    return await this.amrQueryService.getApplicationMembers(id, query);
  }

  @Get('/applications')
  public async getAccountApplications(
    @Query() pageOptionsDto: ApplicationDtoQuery,
    @Query("accountId") accountId: string,
  ): Promise<ApiResponse<IAmr[]>> {
    return await this.amrQueryService.getApplicationsForAccount(
      accountId, pageOptionsDto
    );
  }

  @Post('/application/add')
  public async addAccountToApplication(
    @Body() body: AddAccountToApplicationDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.addAccountToApplication(body);
  }

  @Patch('/application/member')
  public async updateApplicationAccount(
    @Body() body: UpdateAmrDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.updateApplicationAccount(body);
  }

  @Delete('/application/member')
  public async removeAccountFromApplication(
    @Query("id", new ParseUUIDPipe()) id: string,
  ): Promise<ApiResponse<unknown>> {
    return await this.amrService.removeAccountFromApplication(id);
  }
}
