import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ExploreMetricsQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { VISUALIZATION_TYPE, PlotData } from "@traceo/types";
import { EntityManager } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { calculateInterval } from "../../../common/helpers/interval";
import { DashboardPanel } from "../../../db/entities/dashboard-panel.entity";
import { EventQueryService } from "src/api/event/query/event-query.service";

export type AggregateTimeSeries = { minute: number, value: number }[];

export type MetricPreviewType = {
  datasource: PlotData;
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
    panelId: string,
    from: number,
    to: number
  ): Promise<ApiResponse<MetricPreviewType>> {
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

      const isCustomPanel = panel.type === "custom";
      const series = panel.config.series;
      const visualization = panel.config.visualization;

      let datasource = null;

      if (!isCustomPanel) {
        switch (panel.type) {
          case "todays_events":
            datasource = await this.eventService.getTodayEventsGraph(projectId);
            break;
          case "today_events_count":
            datasource = await this.eventService.getTodayEventsCount(projectId);
            break;
          case "overview_events":
            datasource = await this.eventService.getTotalOverviewGraph(projectId);
            break;
          case "last_event_at":
            datasource = await this.eventService.getLastEventTimestamp(projectId);
          default:
            break;
        }
      } else {
        datasource = await this.mapAggregateDataSource(projectId, {
          from, to,
          fields: series.map((e) => e.field),
          interval: 1,
          valueMax: undefined,
          valueMin: undefined,
          isHistogram: visualization === VISUALIZATION_TYPE.HISTOGRAM
        });
      }

      return new ApiResponse("success", undefined, {
        options: panel,
        datasource
      });
    } catch (err) {
      this.logger.error(`[${this.getMetricGraph.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  private async mapAggregateDataSource(projectId: string, query: ExploreMetricsQueryDto) {
    let series = [];
    let time = [];

    // Interval for histogram shouldn't be changed due to time range
    const HISTOGRAM_INTERVAL = 15; //seconds

    const interval = query.isHistogram ? HISTOGRAM_INTERVAL : calculateInterval({
      from: query.from,
      to: query.to
    });

    for (const field of query.fields) {
      const aggregatedMetric = await this.clickhouseService.aggregateMetrics(projectId, field, query, interval);
      if (time.length === 0) {
        time = aggregatedMetric.map(({ minute }) => minute);
      }

      const serie = aggregatedMetric.map(({ value }) => value);
      series.push(serie);
    }

    return [time, ...series];
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

  public async getMetricRawData(projectId: string, query: ExploreMetricsQueryDto): Promise<ApiResponse<any>> {
    try {
      let fields = query.fields || [];

      if (query?.panelId) {
        const metric = await this.entityManager.getRepository(DashboardPanel).findOneBy({
          id: query.panelId
        });

        fields = metric.config.series.map((e) => e.field);
      }

      if (fields.length === 0) {
        return new ApiResponse("success", undefined, []);
      }

      const response = await this.clickhouseService.rawDataMetrics(projectId, {
        ...query,
        fields
      });

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getMetricRawData.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }
}
