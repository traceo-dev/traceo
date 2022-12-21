import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppIncidentsStats } from '../../common/types/interfaces/statistics.interface';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { ErrorDetails } from '../../common/types/interfaces/incident.interface';
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
  ): Promise<ApiResponse<AppIncidentsStats>> {
    return await this.statisticsQueryService.getApplicationStatistics(id);
  }

  @Get('/daily')
  @AuthRequired()
  async getDailyOverview(
    @Query('id') id: string
  ): Promise<ApiResponse<ErrorDetails[]>> {
    return await this.statisticsQueryService.getTodayErrors(id);
  }

  @Get('/total')
  @AuthRequired()
  async getTotalOverview(
    @Query('id') id: string
  ): Promise<ApiResponse<ErrorDetails[]>> {
    return await this.statisticsQueryService.getTotalOverview(id);
  }
}
