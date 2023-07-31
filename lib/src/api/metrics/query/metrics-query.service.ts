import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ExploreMetricsQueryDto, MetricPanelDatasourceQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { VISUALIZATION_TYPE, PlotData } from "@traceo/types";
import { EntityManager } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { calculateInterval } from "../../../common/helpers/interval";
import { DashboardPanel } from "../../../db/entities/dashboard-panel.entity";
import { EventQueryService } from "../../../api/event/query/event-query.service";

// Interval for histogram shouldn't be changed due to time range
const HISTOGRAM_INTERVAL = 15; //seconds

export type AggregateTimeSeries = { minute: number; value: number }[];

export type MetricPreviewType = {
  datasource: PlotData;
};

enum BASIC_DATASOURCES {
  RANDOM = "random_datasource",
  EVENTS = "events_overview"
}

@Injectable()
export class MetricsQueryService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly eventService: EventQueryService,
    private readonly clickhouseService: ClickhouseService
  ) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  public async getMetricsExploreGraph(
    projectId: string,
    query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<MetricPreviewType>> {
    const { fields } = query;

    if (!fields || fields.length === 0) {
      return new ApiResponse("success", undefined, {
        datasource: []
      });
    }

    try {
      const response = await this.queryDatasource(projectId, query);
      return new ApiResponse("success", undefined, {
        datasource: response
      });
    } catch (error) {
      this.logger.error(`[${this.getMetricsExploreGraph.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, []);
    }
  }

  public async getMetricGraph(projectId: string, panelId: string, query: MetricPanelDatasourceQueryDto): Promise<ApiResponse<MetricPreviewType>> {
    const { from, to } = query;

    if (!panelId) {
      throw new Error("Panel ID is required!");
    }

    try {
      const panel = await this.entityManager.getRepository(DashboardPanel).findOneBy({
        id: panelId
      });

      if (!panel) {
        return;
      }

      const series = panel.config.series;
      const visualization = panel.config.visualization;
      const dsFields = series.map((e) => e.datasource.field);

      const datasource = await this.queryDatasource(projectId, {
        from,
        to,
        fields: dsFields,
        isHistogram: visualization === VISUALIZATION_TYPE.HISTOGRAM
      });

      return new ApiResponse("success", undefined, {
        options: panel,
        datasource
      });
    } catch (err) {
      this.logger.error(`[${this.getMetricGraph.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, []);
    }
  }

  private async queryDatasource(projectId: string, query: ExploreMetricsQueryDto) {
    const series = [];

    const interval = query.isHistogram
      ? HISTOGRAM_INTERVAL
      : calculateInterval({
        from: query.from,
        to: query.to
      });

    /**
     * Generating basic timestamp series for x-axis
     */
    const time = await this.getTimestampSerie(query, interval);

    for (const field of query.fields) {
      switch (field) {
        case BASIC_DATASOURCES.EVENTS:
          const values = await this.eventService.getTotalOverviewGraph(query, projectId, interval);
          series.push(values);
          break;
        case BASIC_DATASOURCES.RANDOM:
          const random = await this.clickhouseService.randomValues(time.length);
          const result = random.map(({ value }) => Number(String(value).substring(0, 3)));
          series.push(result);
          break;
        default:
          const metrics = await this.clickhouseService.aggregateMetrics(
            projectId,
            field,
            query,
            interval
          );
          series.push(metrics.map(({ value }) => value));
          break;
      }
    }

    return [time, ...series];
  }

  private async getTimestampSerie(query: ExploreMetricsQueryDto, interval: number = 1) {
    const timestamp = await this.clickhouseService.createTimestampSerie(query, interval);
    return timestamp.map(({ time }) => time);
  }

  public async getMetricFields(projectId: string): Promise<ApiResponse<any>> {
    let availableFields: { value: string, label: string }[] = [];

    try {
      const services = await this.clickhouseService.loadMetricsFields(projectId);
      availableFields = services.map((e) => ({
        value: e["name"],
        label: e["name"]
      }));
    } catch (err) {
      this.logger.error(`[${this.getMetricFields.name}] Caused by: ${err}`);
    }

    // Overview for events received by system
    availableFields.push({
      label: BASIC_DATASOURCES.EVENTS,
      value: BASIC_DATASOURCES.EVENTS
    })

    // Random serie to visualization tests
    availableFields.push({
      label: BASIC_DATASOURCES.RANDOM,
      value: BASIC_DATASOURCES.RANDOM
    });

    return new ApiResponse("success", undefined, availableFields);
  }

  public async getMetricRawData(
    projectId: string,
    query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<any>> {
    try {
      let fields = query.fields || [];

      if (query?.panelId) {
        const metric = await this.entityManager.getRepository(DashboardPanel).findOneBy({
          id: query.panelId
        });

        fields = metric.config.series.map((e) => e.datasource.field);
      }

      if (fields.length === 0) {
        return new ApiResponse("success", undefined, []);
      }

      const interval = query.isHistogram
        ? HISTOGRAM_INTERVAL
        : calculateInterval({
          from: query.from,
          to: query.to
        });

      const response = await this.clickhouseService.rawDataMetrics(
        projectId,
        {
          ...query,
          fields
        },
        interval
      );

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getMetricRawData.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, []);
    }
  }
}
