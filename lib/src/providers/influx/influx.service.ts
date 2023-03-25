import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import {
  IDefaultSDKMetrics,
  ISDKMetrics,
  MetricsResponse,
  IInfluxConfigDto,
  ConnectionStatus,
  DataSourceConnStatus
} from "@traceo/types";
import { MetricQueryDto } from "../../common/types/dto/metrics.dto";
import { BaseProviderService } from "../../common/base/provider/base-provider.service";
import { Datasource } from "../../db/entities/datasource.entity";

type InfluxErrorType = {
  errno?: string;
  statusCode: number;
  statusMessage: string;
  body: string;
  contentType: string;
  json: {
    code: string;
    message: string;
  };
  code: string;
};
@Injectable()
export class InfluxService extends BaseProviderService {
  constructor(public readonly entityManager: EntityManager) {
    super(entityManager);
  }

  public async checkProviderConnection(datasource: Datasource): Promise<DataSourceConnStatus> {
    const details = datasource.details as unknown as IInfluxConfigDto;

    if (!details?.bucket || !details?.org || !datasource?.url) {
      const message = "Missing required fields. Check your configuration.";
      this.logger.error(`InfluxDB [${this.checkProviderConnection.name}] ${message}`);
      return {
        status: ConnectionStatus.FAILED,
        error: message
      };
    }

    const influxDb = new InfluxDB({ url: datasource.url, token: details.token });

    const write = influxDb.getWriteApi(details.org, details.bucket);
    const point = new Point("traceo_conn_test").floatField("test", 0);

    write.writePoint(point);
    return write
      .close()
      .then(() => {
        return {
          status: ConnectionStatus.CONNECTED
        };
      })
      .catch((error: InfluxErrorType) => {
        return {
          status: ConnectionStatus.FAILED,
          error: `${error?.errno || error?.statusCode} : ${error?.json?.message || error?.code}`
        };
      });
  }

  public async writeData(datasource: Datasource, data: ISDKMetrics): Promise<void> {
    const url = datasource?.url;
    const { bucket, token, org } = datasource.details as unknown as IInfluxConfigDto;

    if (!url) {
      this.logger.error(`InfluxDB [${this.queryData.name}] URL are required!`);
      return;
    }

    if (!token) {
      this.logger.error(`InfluxDB [${this.queryData.name}] Token are required!`);
      return;
    }

    if (!org) {
      this.logger.error(`InfluxDB [${this.queryData.name}] Org are required!`);
      return;
    }

    const influxDb = new InfluxDB({ url, token });
    const write = influxDb.getWriteApi(org, bucket);

    const defaultPoint = this.saveDefaultMetrics(datasource.appId, data.default);

    write.writePoint(defaultPoint);
    write
      .close()
      .then(() => this.logger.log(`New metrics write to InfluxDB for appId: ${datasource.appId}`))
      .catch((error) =>
        this.logger.error(
          `Cannot write new metrics to InfluxDB for appId: ${datasource.appId}. Caused by: ${error}`
        )
      );
  }

  private saveDefaultMetrics(applicationId: string, defaultMetrics: IDefaultSDKMetrics): Point {
    const point = new Point(`metrics_${applicationId}`);
    Object.entries(defaultMetrics).forEach(([key, value]) => point.floatField(key, value));
    return point;
  }

  /**
   * https://docs.influxdata.com/influxdb/v2.0/query-data/flux/
   */
  public async queryData(
    datasource: Datasource,
    dtoQuery: MetricQueryDto
  ): Promise<MetricsResponse[]> {
    const url = datasource?.url;
    const { token, org, bucket } = datasource.details as unknown as IInfluxConfigDto;
    const { from, to, fields } = dtoQuery;

    if (!url || !token) {
      this.logger.error(`[${this.queryData.name}] URL and Token are required!`);
      return;
    }

    const influxDb = new InfluxDB({ url, token });
    const queryApi = influxDb.getQueryApi(org);

    const query = `
            from(bucket: "${bucket}")
                |> range(start: ${from}, stop: ${to})
                |> filter(fn: (r) => r._measurement == "metrics_${datasource.appId}")
                |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
                |> keep(columns: [
                    "_time", ${fields.map((f) => `"${f}"`).join(", ")}
                ])
        `;

    try {
      return await queryApi.collectRows(query);
    } catch (error) {
      this.logger.warn(`[${this.queryData.name}] Caused by: ${error}`);
      return [];
    }
  }
}
