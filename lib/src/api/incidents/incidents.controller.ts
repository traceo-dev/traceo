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
import { GuardsService } from '@common/guards/guards.service';
import { AuthAccount } from '@common/decorators/auth-user.decorator';
import { IncidentQueryDto, IncidentUpdateDto, IncidentBatchUpdateDto } from '@common/types/dto/incident.dto';
import { ApiResponse } from '@common/types/dto/response.dto';
import { RequestUser } from '@shared/interfaces/account.interface';
import { IIncident } from '@shared/interfaces/incident.interface';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsService } from './incidents.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';


@ApiTags('incidents')
@Controller('incidents')
@UseGuards(new AuthGuard())
export class IncidentsController {
  constructor(
    private readonly incidentsQueryService: IncidentsQueryService,
    private readonly incidentsService: IncidentsService,
    private readonly permission: GuardsService
  ) { }

  @Get('/:id')
  public async getIncident(@Param("id") id: string): Promise<ApiResponse<IIncident>> {
    return await this.incidentsQueryService.getApiDto(id);
  }

  @Get()
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
  public async updateIncident(
    @Param("id") id: string,
    @Body() body: IncidentUpdateDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.incidentsService.updateIncident(id, body);
  }

  @Delete('/:id')
  public async deleteIncident(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE_INCIDENT', account);

    return await this.incidentsService.removeIncident(id);
  }

  @Post('/batch')
  public async updateBatchIncidents(
    @Body() body: IncidentBatchUpdateDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.incidentsService.updateBatchIncidents(body);
  }
}
