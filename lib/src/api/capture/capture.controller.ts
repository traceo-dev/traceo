import { Body, Controller, Param, Post, Headers, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LogEventPayload, MetricsEventPayload, RuntimeEventPayload, IncidentEventPayload, Dictionary } from "@traceo/types";
import { Request } from "express";
import { ApiResponse } from "src/common/types/dto/response.dto";
import { CaptureService, CAPTURE_ROUTE } from "./capture.service";

@ApiTags("worker")
@Controller("worker")
export class CaptureController {
    constructor(
        private readonly captureService: CaptureService
    ) { }

    @Post("/incident/:id")
    async handleSDKIncidents(
        @Param("id") id: string,
        @Body() data: IncidentEventPayload,
        @Headers() headers: Dictionary<string>,
        @Req() req: Request
    ): Promise<ApiResponse<string> | undefined | void> {
        if (req.method === "OPTIONS") {
            return;
        }

        return await this.captureService.process({
            route: CAPTURE_ROUTE.INCIDENT,
            projectId: id,
            payload: data,
            headers
        });
    }

    @Post("/runtime/:id")
    async handleRuntimeMetrics(
        @Param("id") id: string,
        @Body() data: RuntimeEventPayload,
        @Headers() headers: Dictionary<string>,
        @Req() req: Request
    ): Promise<ApiResponse<string> | undefined | void> {
        if (req.method === "OPTIONS") {
            return;
        }

        return await this.captureService.process({
            route: CAPTURE_ROUTE.RUNTIME,
            projectId: id,
            payload: data,
            headers
        });
    }

    @Post("/log/:id")
    async handleLog(
        @Param("id") id: string,
        @Body() data: LogEventPayload[],
        @Headers() headers: Dictionary<string>,
        @Req() req: Request
    ): Promise<ApiResponse<string> | undefined | void> {
        if (req.method === "OPTIONS") {
            return;
        }

        return await this.captureService.process({
            route: CAPTURE_ROUTE.LOGS,
            projectId: id,
            payload: data,
            headers
        });
    }

    @Post("/metrics/:id")
    async handleMetrics(
        @Param("id") id: string,
        @Body() data: MetricsEventPayload,
        @Headers() headers: Dictionary<string>,
        @Req() req: Request
    ): Promise<ApiResponse<string> | undefined | void> {
        if (req.method === "OPTIONS") {
            return;
        }

        return await this.captureService.process({
            route: CAPTURE_ROUTE.METRICS,
            projectId: id,
            payload: data,
            headers
        });
    }
}
