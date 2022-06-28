import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { OccurrDate } from 'src/db/models/incident';
import { HourlyStatistic, PlotData, WorkspaceStatistics } from 'src/db/models/statistics';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { StatisticsQueryService } from './query/statistics-query.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
    constructor(
        private readonly statisticsQueryService: StatisticsQueryService
    ) { }

    @Get()
    @AuthRequired()
    async getWorkspaceStatistics(
        @Query('id') id: string,
    ): Promise<WorkspaceStatistics> {
        return await this.statisticsQueryService.getWorkspaceStatistics(id);
    }

    @Get('/incident/total')
    @AuthRequired()
    async getIncidentTotalOverview(
        @Query('id') id: string,
        @Query('range') range: number,
    ): Promise<PlotData[]> {
        return await this.statisticsQueryService.getTotalOverviewForIncident(id, range);
    }

    @Get('/daily')
    @AuthRequired()
    async getDailyOverview(
        @Query('id') id: string,
    ): Promise<{ count: number, data: HourlyStatistic[] }> {
        return await this.statisticsQueryService.getDailyOverview(id);
    }

    @Get('/total')
    @AuthRequired()
    async getTotalOverview(
        @Query('id') id: string,
    ): Promise<PlotData[]> {
        return await this.statisticsQueryService.getTotalOverview(id);
    }

    @Get('/dashboard')
    @AuthRequired()
    async getDashboardOverviewStatistics(
        @AuthAccount() account: RequestUser
    ): Promise<any> {
        return await this.statisticsQueryService.getDashboardOverviewStatistics(account);
    }
}
