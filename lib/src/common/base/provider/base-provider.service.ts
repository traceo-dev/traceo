import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { MetricQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { Datasource } from "../../../db/entities/datasource.entity";
import { Logger } from "@nestjs/common";
import {
  ConnectionStatus,
  DataSourceConnStatus,
  ISDKMetrics,
  MetricsResponse
} from "@traceo/types";
import { EntityManager } from "typeorm";

export abstract class BaseProviderService {
  public logger: Logger;

  constructor(public readonly entityManager: EntityManager) {
    this.logger = new Logger(BaseProviderService.name);
  }

  public async healthCheck(datasource: Datasource): Promise<ApiResponse<DataSourceConnStatus>> {
    try {
      const { status, error } = await this.checkProviderConnection(datasource);
      return new ApiResponse("success", undefined, {
        status,
        error
      });
    } catch (err) {
      this.logger.error(`[${this.healthCheck.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, {
        status: ConnectionStatus.FAILED,
        error: err
      });
    }
  }

  public abstract checkProviderConnection(datasource: Datasource): Promise<DataSourceConnStatus>;

  public abstract writeData(datasource: Datasource, data: ISDKMetrics): Promise<void>;

  public abstract queryData(
    datasource: Datasource,
    dtoQuery: MetricQueryDto
  ): Promise<MetricsResponse[]>;
}
