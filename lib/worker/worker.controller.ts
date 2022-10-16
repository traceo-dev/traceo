import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Incident } from 'lib/types/incident';
import { Metrics } from 'lib/types/worker';
import { Logger } from 'traceo';
import { LogsService } from './services/logs.service';
import { MetricsService } from './services/metrics.service';
import { ProcessIncidentsService } from './services/process-incidents.service';
import { RuntimeService } from './services/runtime.service';

@ApiTags('worker')
@Controller('worker')
export class WorkerController {
    logger: Logger;
    constructor(
        private readonly processIncidentsService: ProcessIncidentsService,
        private readonly logsService: LogsService,
        private readonly metricsService: MetricsService,
        private readonly runtimeService: RuntimeService
    ) {
        this.logger = new Logger();
     }

    @Post('/incident/:id')
    async handleSDKIncidents(
        @Param("id") id: number,
        @Body() data: Incident,
    ): Promise<void> {
        this.logger.error(data.type, data.message)
        await this.processIncidentsService.processIncident(id, data);
    }

    @Post("/runtime/:id")
    async handleRuntimeMetrics(
        @Param("id") id: number,
        @Body() data: any
    ): Promise<void> {
        await this.runtimeService.processRuntimeMetrics(id, data);
    }

    @Post("/log/:id")
    async handleLog(
        @Param("id") id: number,
        @Body() data: any
    ): Promise<void> {
        await this.logsService.processLog(id, data);
    }

    @Post("/metrics/:id")
    async handleMetrics(
        @Param("id") id: number,
        @Body() data: Metrics
    ): Promise<void> {
        await this.metricsService.processMetrics(id, data);
    }
}
