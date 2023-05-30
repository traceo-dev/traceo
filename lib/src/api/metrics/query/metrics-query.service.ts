import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ExploreMetricsQueryDto, MetricQueryDto, MetricsQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { IMetric, MetricPreviewType } from "@traceo/types";
import { Metric } from "../../../db/entities/metric.entity";
import { Brackets, EntityManager } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";

export type AggregateTimeSeries = { minute: number, value: number }[];

type GraphByFieldsType = Omit<MetricPreviewType, "options">;

@Injectable()
export class MetricsQueryService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly clickhouseService: ClickhouseService
  ) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  public async getProjectMetrics(
    projectId: string,
    query: MetricsQueryDto
  ): Promise<ApiResponse<IMetric[]>> {
    try {
      const queryBuilder = this.entityManager
        .getRepository(Metric)
        .createQueryBuilder("metric")
        .innerJoinAndSelect("metric.project", "project", "project.id = :projectId", {
          projectId
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
      this.logger.error(`[${this.getProjectMetrics.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getMetricsExploreGraph(
    projectId: string,
    query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<GraphByFieldsType>> {
    const { fields } = query;

    if (!fields || fields.length === 0) {
      return new ApiResponse("success", undefined, {
        datasource: []
      });
    }

    try {
      const response = await this.mapAggregateDataSource(projectId, query);
      return new ApiResponse("success", undefined, {
        datasource: response
      });
    } catch (error) {
      this.logger.error(`[${this.getMetricsExploreGraph.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async getMetricGraph(
    projectId: string,
    metricId: string,
    from: number,
    to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
    if (!projectId || !metricId) {
      throw new Error("Project and metric ids are required!");
    }

    try {
      const metric = await this.entityManager.getRepository(Metric).findOneBy({
        id: metricId,
        project: {
          id: projectId
        }
      });

      if (!metric || metric.series.length === 0) {
        return new ApiResponse("success", undefined, { options: {}, datasource: [] })
      }

      const response = await this.mapAggregateDataSource(projectId, {
        from, to,
        fields: metric.series.map((e) => e.field),
        interval: 1,
        valueMax: undefined,
        valueMin: undefined
      })

      return new ApiResponse("success", undefined, {
        options: metric,
        datasource: response
      });
    } catch (err) {
      this.logger.error(`[${this.getMetricGraph.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  /**
   * TODO: aggregate results from time series in clickhouse query instead here. 
   */
  private async mapAggregateDataSource(projectId: string, query: ExploreMetricsQueryDto) {
    let response = [];

    for (const field of query.fields) {
      const aggregatedMetric = await this.clickhouseService.aggregateMetrics(projectId, field, query);
      const result = aggregatedMetric.map(({ minute, value }) => ([minute, value]));
      response.push(result);
    }

    return response;
  }

  public async getMetricFields(projectId: string): Promise<ApiResponse<any>> {
    try {
      const services = await this.clickhouseService.loadMetricsFields(projectId);
      const response = services.map((e) => ({
        value: e["name"],
        label: e["name"]
      }));
      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getMetricFields.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }
}
