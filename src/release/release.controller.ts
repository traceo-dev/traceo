import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseDtoQuery } from 'src/core/generic.model';
import { Release } from 'src/db/entities/release.entity';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { ReleaseQueryService } from './query/release-query.service';

@ApiTags('releases')
@Controller('releases')
export class ReleaseController {
    constructor(
        private readonly releaseQueryService: ReleaseQueryService
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
}
