import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Incident } from '../types/incident';
import { Metrics } from '../types/worker';
import { LogsService } from './services/logs.service';
import { MetricsService } from './services/metrics.service';
import { ProcessIncidentsService } from './services/process-incidents.service';
import { RuntimeService } from './services/runtime.service';

@ApiTags('worker')
@Controller('worker')
export class WorkerController {
    constructor(
        private readonly processIncidentsService: ProcessIncidentsService,
        private readonly logsService: LogsService,
        private readonly metricsService: MetricsService,
        private readonly runtimeService: RuntimeService
    ) { }

    @Post('/incident/:id')
    async handleSDKIncidents(
        @Param("id") id: number,
        @Body() data: Incident,
    ): Promise<void> {
        await this.processIncidentsService.processWorkerData(id, data);
    }

    @Post("/runtime/:id")
    async handleRuntimeMetrics(
        @Param("id") id: number,
        @Body() data: any
    ): Promise<void> {
        await this.runtimeService.processWorkerData(id, data);
    }

    @Post("/log/:id")
    async handleLog(
        @Param("id") id: number,
        @Body() data: any
    ): Promise<void> {
        await this.logsService.processWorkerData(id, data);
    }

    @Post("/metrics/:id")
    async handleMetrics(
        @Param("id") id: number,
        @Body() data: Metrics
    ): Promise<void> {
        await this.metricsService.processWorkerData(id, data);
    }
}
