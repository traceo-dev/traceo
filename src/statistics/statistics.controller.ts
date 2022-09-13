import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { Environment } from 'src/core/generic.model';
import { HourlyStats, PlotData, AppStats } from 'src/types/statistics';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { Env } from 'src/libs/decorators/env.decorator';
import { StatisticsQueryService } from './query/statistics-query.service';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsQueryService: StatisticsQueryService,
  ) {}

  @Get()
  @AuthRequired()
  async getApplicationStatistics(
    @Query('id') id: string,
    @Env() env: Environment,
  ): Promise<AppStats> {
    return await this.statisticsQueryService.getApplicationStatistics(id, env);
  }

  @Get('/incident/total')
  @AuthRequired()
  async getIncidentTotalOverview(
    @Query('id') id: string,
    @Env() env: Environment,
  ): Promise<PlotData[]> {
    return await this.statisticsQueryService.getTotalOverviewForIncident(
      id,
      env,
    );
  }

  @Get('/daily')
  @AuthRequired()
  async getDailyOverview(
    @Query('id') id: string,
    @Env() env: Environment,
  ): Promise<{ count: number; data: HourlyStats[] }> {
    return await this.statisticsQueryService.getDailyOverview(id, env);
  }

  @Get('/total')
  @AuthRequired()
  async getTotalOverview(
    @Query('id') id: string,
    @Env() env: Environment,
  ): Promise<PlotData[]> {
    return await this.statisticsQueryService.getTotalOverview(id, env);
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
