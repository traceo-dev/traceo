import { Body, Controller, Param, Post, Headers } from '@nestjs/common';
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
        @Body() data: IMetrics,
        @Headers() headers: { [key: string]: any }
    ): Promise<void> {
        await this.metricsService.processWorkerData(id, data, headers);
    }
}
