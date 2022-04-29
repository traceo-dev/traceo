import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongodbModule } from 'src/db/mongodb.module';
import { StatisticsQueryService } from './query/statistics-query.service';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongodbModule
  ],
  providers: [StatisticsQueryService],
  controllers: [StatisticsController]
})
export class StatisticsModule { }
