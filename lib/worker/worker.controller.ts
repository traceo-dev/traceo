import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TraceoIncidentModel } from '../../lib/types/interfaces/incident.interface';
import { TraceoLog } from '../../lib/types/interfaces/log.interface';
import { IMetrics } from '../../lib/types/interfaces/metrics.interface';
import { IRuntime } from '../../lib/types/interfaces/runtime.interface';
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
        @Body() data: TraceoIncidentModel,
    ): Promise<void> {
        if (process.env.DEMO === "true") {
            return;
        }

        await this.processIncidentsService.processWorkerData(id, data);
    }

    @Post("/runtime/:id")
    async handleRuntimeMetrics(
        @Param("id") id: number,
        @Body() data: IRuntime
    ): Promise<void> {
        if (process.env.DEMO === "true") {
            return;
        }

        await this.runtimeService.processWorkerData(id, data);
    }

    @Post("/log/:id")
    async handleLog(
        @Param("id") id: number,
        @Body() data: TraceoLog
    ): Promise<void> {
        if (process.env.DEMO === "true") {
            return;
        }

        await this.logsService.processWorkerData(id, data);
    }

    @Post("/metrics/:id")
    async handleMetrics(
        @Param("id") id: number,
        @Body() data: IMetrics
    ): Promise<void> {
        if (process.env.DEMO === "true") {
            return;
        }

        await this.metricsService.processWorkerData(id, data);
    }
}
