import { Module } from '@nestjs/common';
import { ApplicationQueryService } from 'lib/application/application-query/application-query.service';
import { IncidentsQueryService } from 'lib/incidents/incidents-query/incidents-query.service';
import { InfluxService } from '../dataSource/influx/influx.service';
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
