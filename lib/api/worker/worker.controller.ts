import { Body, Controller, Param, Post, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TraceoIncidentModel } from '@common/types/interfaces/incident.interface';
import { TraceoLog } from '@common/types/interfaces/log.interface';
import { ISDKMetrics } from '@common/types/interfaces/metrics.interface';
import { IRuntime } from '@common/types/interfaces/runtime.interface';
import { WorkerLogsService } from './services/worker-logs.service';
import { WorkerMetricsService } from './services/worker-metrics.service';
import { WorkerIncidentsService } from './services/worker-incidents.service';
import { WorkerRuntimeService } from './services/worker-runtime.service';

@ApiTags('worker')
@Controller('worker')
export class WorkerController {
    constructor(
        private readonly processIncidentsService: WorkerIncidentsService,
        private readonly logsService: WorkerLogsService,
        private readonly metricsService: WorkerMetricsService,
        private readonly runtimeService: WorkerRuntimeService
    ) { }

    @Post('/incident/:id')
    async handleSDKIncidents(
        @Param("id") id: string,
        @Body() data: TraceoIncidentModel,
        @Headers() headers: { [key: string]: any }
    ): Promise<void> {
        await this.processIncidentsService.processWorkerData(id, data, headers);
    }

    @Post("/runtime/:id")
    async handleRuntimeMetrics(
        @Param("id") id: string,
        @Body() data: IRuntime,
        @Headers() headers: { [key: string]: any }
    ): Promise<void> {
        await this.runtimeService.processWorkerData(id, data, headers);
    }

    @Post("/log/:id")
    async handleLog(
        @Param("id") id: string,
        @Body() data: TraceoLog,
        @Headers() headers: { [key: string]: any }
    ): Promise<void> {
        await this.logsService.processWorkerData(id, data, headers);
    }

    @Post("/metrics/:id")
    async handleMetrics(
        @Param("id") id: string,
        @Body() data: ISDKMetrics,
        @Headers() headers: { [key: string]: any }
    ): Promise<void> {
        await this.metricsService.processWorkerData(id, data, headers);
    }
}
