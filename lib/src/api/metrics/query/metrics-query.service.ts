import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { MetricQueryDto, MetricsQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import {
  IMetric,
  IMetricSerie,
  MetricPreviewType,
  MetricResponseType,
  TimeSerieMetric
} from "@traceo/types";
import { Metric } from "../../../db/entities/metric.entity";
import { Brackets, EntityManager } from "typeorm";
import { ClickhouseService } from "src/common/services/clickhouse/clickhouse.service";

@Injectable()
export class MetricsQueryService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly clickhouseService: ClickhouseService
  ) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  async getMetricData(
    appId: string,
    query: MetricQueryDto
  ): Promise<ApiResponse<MetricResponseType[]>> {
    try {
      const response = await this.clickhouseService.loadMetric(appId, query);
      const groupedMetrics = this.groupMetrics(response);

      return new ApiResponse("success", undefined, groupedMetrics);
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

  /**
   * Group metrics to return values already parsed for charts:
   * {
   *   time: [...],
   *   heap_used: [...],
   *   heap_total: [...]
   * }
   */
  private groupMetrics(data: TimeSerieMetric[]): any {
    const time = new Set();
    const result = data.reduce((acc, val) => {
      acc[val.name] = acc[val.name] || [];
      acc[val.name].push(val.value);

      // time can be duplicated from clickhouse response, so we use Set to avoid duplicates
      time.add(val.timestamp);

      return acc;
    }, {})

    return {
      ...result,
      time: Array.from(time)
    };
  }
}
