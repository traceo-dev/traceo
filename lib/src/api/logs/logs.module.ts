import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { PassportModule } from '@nestjs/passport';
import { ClickhouseModule } from '../../common/services/clickhouse/clickhouse.module';
import { LogsQueryService } from './logs-query/logs-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ClickhouseModule
  ],
  controllers: [LogsController],
  providers: [LogsQueryService],
  exports: [LogsQueryService]
})
export class LogsModule { }
