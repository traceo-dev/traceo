import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { Release } from 'src/db/entities/release.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { WorkspaceModel } from 'src/workspace/workspace.model';
import { ReleaseQueryService } from './query/release-query.service';
import { ReleaseModel } from './release.model';
import { ReleaseService } from './release.service';

@ApiTags('releases')
@Controller('releases')
export class ReleaseController {
    constructor(
        private readonly releaseQueryService: ReleaseQueryService,
        private readonly releaseService: ReleaseService,
    ) { }

    @Get()
    @AuthRequired()
    async getReleases(
        @Query('id') id: string,
        @Query() query: BaseDtoQuery
    ): Promise<Release[]> {

        return await this.releaseQueryService.listDto({
            workspaceId: id, ...query
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
}
