import { Module } from '@nestjs/common';
import { InfluxService } from '../../providers/influx/influx.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { LogsService } from './services/logs.service';
import { MetricsService } from './services/metrics.service';
import { ProcessIncidentsService } from './services/process-incidents.service';
import { RuntimeService } from './services/runtime.service';
import { WorkerController } from './worker.controller';

@Module({
  imports: [],
  providers: [
    ProcessIncidentsService,
    MetricsService,
    RuntimeService,
    LogsService,
    InfluxService,
    ApplicationQueryService
  ],
  controllers: [WorkerController]
})
export class WorkerModule { }
