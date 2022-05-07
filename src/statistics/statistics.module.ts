import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StatisticsQueryService } from './query/statistics-query.service';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [StatisticsQueryService],
  controllers: [StatisticsController]
})
export class StatisticsModule { }
