import { Injectable, Logger } from "@nestjs/common";
import { Span } from "@traceo/types";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { QueryTracingDto } from "../../../common/types/dto/tracing";

@Injectable()
export class TracingQueryService {
  private readonly logger: Logger;
  constructor(private readonly clickhouseService: ClickhouseService) {
    this.logger = new Logger(TracingQueryService.name);
  }

  public async getRootTraces(query: QueryTracingDto): Promise<ApiResponse<Span[]>> {
    try {
      const response = await this.clickhouseService.loadRootTraces(query);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getRootTraces.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async getSpansByTraceId(traceId: string): Promise<ApiResponse<Span[]>> {
    try {
      const response = await this.clickhouseService.loadSpansByTraceId<Span>(traceId);
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getSpansByTraceId.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async getServiceNames(projectId: string): Promise<ApiResponse<any>> {
    try {
      const services = await this.clickhouseService.loadTracingServiceNames(projectId);
      const response = services.map((e) => ({
        value: e["service_name"],
        label: e["service_name"]
      }));
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getServiceNames.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async getSpansNames(projectId: string): Promise<ApiResponse<any>> {
    try {
      const services = await this.clickhouseService.loadSpansNames(projectId);
      const response = services.map((e) => ({
        value: e["name"],
        label: e["name"]
      }));
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getServiceNames.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }
}
