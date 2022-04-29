import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspaceStatistics } from 'src/db/models/statistics';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { StatisticsQueryService } from './query/statistics-query.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsQueryService: StatisticsQueryService
    ) {}

    @Get()
    @AuthRequired()
    async getWorkspaceStatistics(
        @Query('id') id: string,
    ): Promise<WorkspaceStatistics> {
        return await this.statisticsQueryService.getWorkspaceStatistics(id);
    }
}
