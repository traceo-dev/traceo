import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'lib/auth/auth.model';
import { HourlyStats, PlotData, AppStats } from 'lib/types/statistics';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import { StatisticsQueryService } from './query/statistics-query.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsQueryService: StatisticsQueryService,
  ) { }

  @Get()
  @AuthRequired()
  async getApplicationStatistics(
    @Query('id') id: string
  ): Promise<AppStats> {
    return await this.statisticsQueryService.getApplicationStatistics(id);
  }

  @Get('/incident/total')
  @AuthRequired()
  async getIncidentTotalOverview(
    @Query('id') id: string
  ): Promise<PlotData[]> {
    return await this.statisticsQueryService.getTotalOverviewForIncident(
      id
    );
  }

  @Get('/daily')
  @AuthRequired()
  async getDailyOverview(
    @Query('id') id: string
  ): Promise<{ count: number; data: HourlyStats[] }> {
    return await this.statisticsQueryService.getDailyOverview(id);
  }

  @Get('/total')
  @AuthRequired()
  async getTotalOverview(
    @Query('id') id: string
  ): Promise<PlotData[]> {
    return await this.statisticsQueryService.getTotalOverview(id);
  }

  @Get('/dashboard')
  @AuthRequired()
  async getDashboardOverviewStatistics(
    @AuthAccount() account: RequestUser,
  ): Promise<any> {
    return await this.statisticsQueryService.getDashboardOverviewStatistics(
      account,
    );
  }
}
