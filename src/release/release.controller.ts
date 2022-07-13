import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseDtoQuery } from 'src/core/generic.model';
import { Incident } from 'src/db/entities/incident.entity';
import { Release } from 'src/db/entities/release.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { ReleaseQueryService } from './query/release-query.service';
import { CreateReleaseModal, ReleaseModel } from './release.model';
import { ReleaseService } from './release.service';

@ApiTags('release')
@Controller('release')
export class ReleaseController {
    constructor(
        private readonly releaseQueryService: ReleaseQueryService,
        private readonly releaseService: ReleaseService,
    ) { }

    @Get()
    @AuthRequired()
    async getReleases(
        @Query('id') id: number,
        @Query() query: BaseDtoQuery
    ): Promise<Release[]> {
        return await this.releaseQueryService.listDto({
            appId: id, ...query
        });
    }

    @Get('/:id')
    @AuthRequired()
    async getRelease(
        @Param("id") id: string
    ): Promise<Release | null> {
        return await this.releaseQueryService.getDto(id);
    }

    @Patch()
    @AuthRequired()
    async updateRelease(
        @Body() update: ReleaseModel,
    ): Promise<void> {
        return await this.releaseService.updateRelease(update);
    }

    @Post()
    @AuthRequired()
    async createRelease(
        @Body() body: CreateReleaseModal,
    ): Promise<void> {
        return await this.releaseService.createRelease(body)
    }

    @Get('/incidents/resolved/:id')
    @AuthRequired()
    async getIncidentsResolvedInRelease(
        @Param("id") id: string
    ): Promise<Incident[]> {
        return await this.releaseQueryService.getIncidentsResolvedInRelease(id)
    }

    @Get('/incidents/catched')
    @AuthRequired()
    async getIncidentsCatchedInRelease(
        @Query() query: { id: number, version: string }
    ): Promise<Incident[]> {
        const { id, version } = query;
        return await this.releaseQueryService.getIncidentsCatchedInRelease(id, version);
    }

    @Delete('/:id')
    @AuthRequired()
    public async deleteIncident(
        @Param("id") id: string
    ): Promise<void> {
        return await this.releaseService.removeRelease(id);
    }
}
