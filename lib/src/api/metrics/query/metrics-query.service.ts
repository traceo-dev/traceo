import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ExploreMetricsQueryDto, MetricPanelDatasourceQueryDto } from "../../../common/types/dto/metrics.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { VISUALIZATION_TYPE, PlotData } from "@traceo/types";
import { EntityManager } from "typeorm";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { calculateInterval } from "../../../common/helpers/interval";
import { DashboardPanel } from "../../../db/entities/dashboard-panel.entity";

// Interval for histogram shouldn't be changed due to time range
const HISTOGRAM_INTERVAL = 15; //seconds

export type AggregateTimeSeries = { minute: number; value: number }[];

export type DatasourceType = {
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
    private readonly clickhouseService: ClickhouseService
  ) {
    this.logger = new Logger(MetricsQueryService.name);
  }

  public async getExploreGraphDatasource(
    projectId: string,
    query: ExploreMetricsQueryDto
  ): Promise<ApiResponse<DatasourceType>> {
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
      this.logger.error(`[${this.getExploreGraphDatasource.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, []);
    }
  }

  public async getPanelGraphDatasource(projectId: string, panelId: string, query: MetricPanelDatasourceQueryDto): Promise<ApiResponse<DatasourceType>> {
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
        ...query,
        fields: dsFields,
        isHistogram: visualization === VISUALIZATION_TYPE.HISTOGRAM
      });

      return new ApiResponse("success", undefined, {
        options: panel,
        datasource
      });
    } catch (err) {
      this.logger.error(`[${this.getPanelGraphDatasource.name}] Caused by: ${err}`);
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
    const generatedTimestamp = await this.clickhouseService.createTimestampSerie(query, interval);
    const time = generatedTimestamp[0].timestamps ?? [];

    for (const field of query.fields) {
      switch (field) {
        case BASIC_DATASOURCES.EVENTS:
          const eventsGraph = await this.clickhouseService.loadProjectEventsGraph(projectId, { ...query, interval });
          series.push(eventsGraph[0].events_count ?? []);
          break;
        case BASIC_DATASOURCES.RANDOM:
          const randomGraph = await this.clickhouseService.randomValues(time.length);
          series.push(randomGraph[0].random ?? []);
          break;
        default:
          const metrics = await this.clickhouseService.queryAggregatedMetrics(projectId, field, { ...query, interval });
          series.push(metrics[0].metric_value);
          break;
      }
    }

    return [time, ...series];
  }

  public async getDatasourceFields(projectId: string): Promise<ApiResponse<any>> {
    let availableFields: { value: string, label: string }[] = [];

    try {
      const services = await this.clickhouseService.loadMetricsFields(projectId);
      availableFields = services.map((e) => ({
        value: e["name"],
        label: e["name"]
      }));
    } catch (err) {
      this.logger.error(`[${this.getDatasourceFields.name}] Caused by: ${err}`);
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

  public async getPanelRawDataDatasource(
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

      const response = await this.clickhouseService.rawDataMetrics(projectId, {
        ...query, fields
      }, interval);

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getPanelRawDataDatasource.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, []);
    }
  }
}
