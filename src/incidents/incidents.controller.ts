import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Incident } from 'src/db/entities/incident.entity';
import { IncidentBatchUpdateDto, IncidentQueryDto, IncidentUpdateDto } from 'src/db/models/incident';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsService } from './incidents.service';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(
        private readonly incidentsQueryService: IncidentsQueryService,
        private readonly incidentsService: IncidentsService
    ) {}

    @Get('/:id')
    @AuthRequired()
    public async getIncident(
        @Param("id") id: string,
    ): Promise<Incident | null> {
        return await this.incidentsQueryService.getDto(id);
    }

    @Get()
    @AuthRequired()
    public async getIncidents(
        @Query("id", new ParseUUIDPipe()) id: string,
        @Query() query: IncidentQueryDto
    ): Promise<Incident[]> {
        return await this.incidentsQueryService.listDto({ workspaceId: id, ...query });
    }

    @Patch('/:id')
    @AuthRequired()
    public async updateIncident(
        @Param("id") id: string,
        @Body() body: IncidentUpdateDto
    ): Promise<void> {
        return await this.incidentsService.updateIncident(id, body);
    }

    @Post('/batch')
    @AuthRequired()
    public async updateBatchIncidents(
        @Body() body: IncidentBatchUpdateDto
    ): Promise<void> {
        return await this.incidentsService.updateBatchIncidents(body);
    }
}
