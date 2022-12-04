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
import { AccountPermissionService } from '../../lib/account/account-permission/account-permission.service';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { IncidentQueryDto, IncidentUpdateDto, IncidentBatchUpdateDto } from '../../lib/types/dto/incident.dto';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsService } from './incidents.service';
import { IIncident } from '../../lib/types/interfaces/incident.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsQueryService: IncidentsQueryService,
    private readonly incidentsService: IncidentsService,
    private readonly permission: AccountPermissionService
  ) { }

  @Get('/:id')
  @AuthRequired()
  public async getIncident(@Param("id") id: string): Promise<ApiResponse<IIncident>> {
    return await this.incidentsQueryService.getApiDto(id);
  }

  @Get()
  @AuthRequired()
  public async getIncidents(
    @Query("id") id: string,
    @Query() query: IncidentQueryDto
  ): Promise<ApiResponse<IIncident[]>> {
    return await this.incidentsQueryService.getApiListDto({
      appId: id,
      ...query
    });
  }

  @Patch('/:id')
  @AuthRequired()
  public async updateIncident(
    @Param("id") id: string,
    @Body() body: IncidentUpdateDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.incidentsService.updateIncident(id, body);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteIncident(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE_INCIDENT', account);

    return await this.incidentsService.removeIncident(id);
  }

  @Post('/batch')
  @AuthRequired()
  public async updateBatchIncidents(
    @Body() body: IncidentBatchUpdateDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.incidentsService.updateBatchIncidents(body);
  }
}
