import { Body, Controller, Post, Headers, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  LogEventPayload,
  IncidentEventPayload,
  Dictionary,
  BrowserPerfsPayloadEvent,
  MetricData,
  TraceoMetric,
  TraceoSpan
} from "@traceo/types";
import { Request } from "express";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { CaptureService, CAPTURE_ROUTE } from "./capture.service";

@ApiTags("capture")
@Controller("capture")
export class CaptureController {
  constructor(private readonly captureService: CaptureService) {}

  @Post("/incident")
  async handleSDKIncidents(
    @Body() data: IncidentEventPayload,
    @Headers() headers: Dictionary<string>,
    @Req() req: Request
  ): Promise<ApiResponse<string> | undefined | void> {
    if (req.method === "OPTIONS") {
      return;
    }

    return await this.captureService.process({
      route: CAPTURE_ROUTE.INCIDENT,
      payload: data,
      headers
    });
  }

  @Post("/log")
  async handleLog(
    @Body() data: LogEventPayload[],
    @Headers() headers: Dictionary<string>,
    @Req() req: Request
  ): Promise<ApiResponse<string> | undefined | void> {
    if (req.method === "OPTIONS") {
      return;
    }

    return await this.captureService.process({
      route: CAPTURE_ROUTE.LOGS,
      payload: data,
      headers
    });
  }

  @Post("/metrics")
  async handleMetrics(
    @Body() data: TraceoMetric[],
    @Headers() headers: Dictionary<string>,
    @Req() req: Request
  ): Promise<ApiResponse<string> | undefined | void> {
    if (req.method === "OPTIONS") {
      return;
    }

    return await this.captureService.process({
      route: CAPTURE_ROUTE.METRICS,
      payload: data,
      headers
    });
  }

  @Post("/traces")
  async handleTracing(
    @Body() body: TraceoSpan[],
    @Headers() headers: Dictionary<string>,
    @Req() req: Request
  ): Promise<ApiResponse<string> | undefined | void> {
    if (req.method === "OPTIONS") {
      return;
    }

    return await this.captureService.process({
      route: CAPTURE_ROUTE.TRACING,
      payload: body,
      headers
    });
  }

  @Post("/browser/perfs")
  async handleBrowserPerfs(
    @Body() data: BrowserPerfsPayloadEvent[],
    @Headers() headers: Dictionary<string>,
    @Req() req: Request
  ): Promise<ApiResponse<string> | undefined | void> {
    if (req.method === "OPTIONS") {
      return;
    }

    return await this.captureService.process({
      route: CAPTURE_ROUTE.BROWSER_PERFS,
      payload: data,
      headers
    });
  }
}
