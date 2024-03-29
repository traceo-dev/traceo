import { Injectable } from "@nestjs/common/decorators";
import { Logger } from "@nestjs/common";
import { IEvent, UplotDataType } from "@traceo/types";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import dayjs from "dayjs";
import { ClickhouseService } from "../../../common/services/clickhouse/clickhouse.service";
import { BadRequestError } from "../../../common/helpers/errors";
import { ProjectQueryService } from "../../../api/project/project-query/project-query.service";
import dateUtils from "../../../common/helpers/dateUtils";
import { ExploreMetricsQueryDto } from "../../../common/types/dto/metrics.dto";

@Injectable()
export class EventQueryService {
  private readonly logger: Logger;

  constructor(
    private readonly clickhouse: ClickhouseService,
    private readonly projectQuery: ProjectQueryService
  ) {
    this.logger = new Logger(EventQueryService.name);
  }

  public async getEventsForIncident(incidentId: string): Promise<ApiResponse<IEvent[]>> {
    try {
      const events = await this.clickhouse.loadEventsForIncident(incidentId);
      const response = events.map((event) => ({
        ...event,
        details: event.details ? JSON.parse(event.details) : {}
      }));

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getEventsForIncident.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  // incident analytics

  public async getOverviewEventsForIncidentGraph(id: string): Promise<ApiResponse<any>> {
    const to = dayjs().add(1, "day").utc().unix();
    const from = dayjs().subtract(1, "months").utc().unix();

    try {
      const graph = await this.getIncidentGraphPayload(id, from, to, 60 * 24);
      return new ApiResponse("success", undefined, {
        graph: graph
      });
    } catch (error) {
      this.logger.error(`[${this.getOverviewEventsForIncidentGraph.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async getTodayEventsForIncidentGraph(id: string): Promise<ApiResponse<IEvent[]>> {
    const from = dayjs().startOf("day").unix();
    const to = dayjs().endOf("day").add(1, "h").unix();

    try {
      const todayCount = await this.clickhouse.loadTodayIncidentEventsCount(id);
      const graph = await this.getIncidentGraphPayload(id, from, to);

      return new ApiResponse("success", undefined, {
        graph: graph,
        count: todayCount
      });
    } catch (error) {
      this.logger.error(`[${this.getTodayEventsForIncidentGraph.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  // project analytics

  // public async getTodayEventsGraph(projectId: string) {
  //   const from = dayjs().startOf("day").unix();
  //   const to = dayjs().endOf("day").add(1, "h").unix();

  //   try {
  //     return await this.getProjectGraphPayload(projectId, from, to);
  //   } catch (error) {
  //     this.logger.error(`[${this.getTodayEventsGraph.name}] Caused by: ${error}`);
  //     throw new BadRequestError(error);
  //   }
  // }

  // public async getTodayEventsCount(projectId: string) {
  //   try {
  //     return await this.clickhouse.loadTodayEventsCount(projectId);
  //   } catch (error) {
  //     this.logger.error(`[${this.getTodayEventsCount.name}] Caused by: ${error}`);
  //     throw new BadRequestError(error);
  //   }
  // }

  public async getTotalOverviewGraph(query: ExploreMetricsQueryDto, projectId: string, interval: number) {
    try {
      const eventsGraph = await this.clickhouse.loadProjectEventsGraph(projectId, { ...query, interval });
      return eventsGraph[0].events_count;
    } catch (error) {
      this.logger.error(`[${this.getTotalOverviewGraph.name}] Caused by: ${error}`);
      throw new BadRequestError(error);
    }
  }

  // public async getLastEventTimestamp(projectId: string) {
  //   const NO_TIMESTAMP = "--:--";
  //   try {
  //     const project = await this.projectQuery.getDto(projectId);
  //     const lastEventTimestamp = project.lastEventAt;

  //     if (!lastEventTimestamp) {
  //       return NO_TIMESTAMP;
  //     }

  //     return dayjs.unix(lastEventTimestamp).utc().isToday()
  //       ? dateUtils.formatDate(lastEventTimestamp, "HH:mm")
  //       : NO_TIMESTAMP;
  //   } catch (error) {
  //     this.logger.error(`[${this.getLastEventTimestamp.name}] Caused by: ${error}`);
  //     throw new BadRequestError(error);
  //   }
  // }

  // helpers

  private async getIncidentGraphPayload(
    incidentId: string,
    from: number,
    to: number,
    interval = 60
  ) {
    const events = await this.clickhouse.loadIncidentEventsGraph(incidentId, {
      from,
      to,
      interval
    });

    const time = events.map((e) => e.time);
    const count = events.map((e) => e.count);

    return [time, count];
  }
}
