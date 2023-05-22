import { Module } from '@nestjs/common';
import { TracingController } from './tracing.controller';
import { TracingService } from './tracing.service';
import { PassportModule } from '@nestjs/passport';
import { ClickhouseModule } from '../../common/services/clickhouse/clickhouse.module';
import { TracingQueryService } from './tracing-query/tracing-query.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), ClickhouseModule],
  controllers: [TracingController],
  providers: [TracingService, TracingQueryService],
  exports: [TracingService, TracingQueryService]
})
export class TracingModule { }
