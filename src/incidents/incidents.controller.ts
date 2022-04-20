import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageableDto, PageOptionsDto } from 'src/core/core.model';
import { Incident, IncidentSearchDto } from 'src/db/documents/incident';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(
        private readonly incidentsQueryService: IncidentsQueryService
    ) {}

    @Get('/:id')
    @AuthRequired()
    public async getIncident(
        @Param("id") id: string,
    ): Promise<Incident | null> {
        return await this.incidentsQueryService.getIncident(id);
    }

    @Get()
    @AuthRequired()
    @ApiPaginatedResponse()
    public async getIncidents(
        @Query("id", new ParseUUIDPipe()) id: string,
        @Query() pageOptionsDto: IncidentSearchDto
    ): Promise<PageableDto<Incident>> {
        return await this.incidentsQueryService.getIncidents(id, pageOptionsDto);
    }
}
