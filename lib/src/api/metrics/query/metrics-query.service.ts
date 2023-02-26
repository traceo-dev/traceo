import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { MetricQueryDto, MetricsQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import {
  IMetric,
  IMetricSerie,
  MetricPreviewType,
  MetricsResponse,
  DatasourceProvider
} from "@traceo/types";
import { Metric } from "../../../db/entities/metric.entity";
import { InfluxService } from "../../../providers/influx/influx.service";
import { Brackets, EntityManager } from "typeorm";
import { BaseProviderService } from "../../../common/base/provider/base-provider.service";
import { Datasource } from "../../../db/entities/datasource.entity";
import { Application } from "../../../db/entities/application.entity";

@Injectable()
export class MetricsQueryService {
  private readonly logger: Logger;

  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  async getMetricData(
    appId: string,
    query: MetricQueryDto
  ): Promise<ApiResponse<MetricsResponse[]>> {
    try {
      const app = await this.entityManager.getRepository(Application).findOneBy({ id: appId });
      if (!app?.tsdbDatasource) {
        this.logger.error(`[${this.getMetricData.name}] Not connected time series db.`);
        return;
      }

      const datasource = await this.entityManager
        .getRepository(Datasource)
        .findOneBy({ id: app.tsdbDatasource });
      if (!datasource) {
        return;
      }

      const services = new Map<DatasourceProvider, BaseProviderService>([
        [DatasourceProvider.INLFUX_DB, new InfluxService(this.entityManager)]
      ]);

      const service = services.get(datasource.type);
      if (!service) {
        throw new Error("Service not implemented!");
      }

      const response = await service.queryData(datasource, query);
      return new ApiResponse("success", undefined, response);
    } catch (err) {
      this.logger.error(`[${this.getMetricData.name}] Caused by: ${err}`);
      return new ApiResponse("error", undefined, []);
    }
  }

  public async getApplicationMetrics(
    appId: string,
    query: MetricsQueryDto
  ): Promise<ApiResponse<IMetric[]>> {
    try {
      // await this.influxService.checkConnection(appId);

      const queryBuilder = this.entityManager
        .getRepository(Metric)
        .createQueryBuilder("metric")
        .innerJoinAndSelect("metric.application", "application", "application.id = :appId", {
          appId
        });

      if (query?.search) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("LOWER(metric.name) LIKE LOWER(:search)", {
              search: `%${query.search}%`
            }).orWhere("LOWER(metric.description) LIKE LOWER(:search)", {
              search: `%${query.search}%`
            });
          })
        );
      }

      const metrics = await queryBuilder.getMany();
      return new ApiResponse("success", undefined, metrics);
    } catch (err) {
      this.logger.error(`[${this.getApplicationMetrics.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getApplicationMetricPreviewData(
    appId: string,
    metricId: string,
    from: number,
    to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
    if (!appId || !metricId) {
      throw new Error("App and metric ids are required!");
    }

    try {
      const metric = await this.entityManager.getRepository(Metric).findOneBy({
        id: metricId,
        application: {
          id: appId
        }
      });

      const datasource = await this.getMetricData(appId, {
        fields: this.parseSeries(metric.series),
        from,
        to
      });

      return new ApiResponse("success", undefined, {
        options: metric,
        datasource: datasource.data || []
      });
    } catch (err) {
      this.logger.error(`[${this.getApplicationMetricPreviewData.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  private parseSeries(series: IMetricSerie[]): string[] {
    return (
      series?.reduce<string[]>((acc, serie) => {
        acc.push(serie.field);

        return acc;
      }, []) || []
    );
  }
}
