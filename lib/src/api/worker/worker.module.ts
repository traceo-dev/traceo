import { Module } from '@nestjs/common';
import { InfluxService } from '../../providers/influx/influx.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { WorkerLogsService } from './services/worker-logs.service';
import { WorkerMetricsService } from './services/worker-metrics.service';
import { WorkerIncidentsService } from './services/worker-incidents.service';
import { WorkerRuntimeService } from './services/worker-runtime.service';
import { WorkerController } from './worker.controller';

@Module({
  imports: [],
  providers: [
    WorkerIncidentsService,
    WorkerMetricsService,
    WorkerRuntimeService,
    WorkerLogsService,
    InfluxService,
    ApplicationQueryService
  ],
  controllers: [WorkerController],
  exports: [
    WorkerIncidentsService,
    WorkerMetricsService,
    WorkerRuntimeService,
    WorkerLogsService
  ]
})
export class WorkerModule { }
