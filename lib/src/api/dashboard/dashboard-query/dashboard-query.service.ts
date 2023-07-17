import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { DashboardPanel } from "../../../db/entities/dashboard-panel.entity";
import { Dashboard } from "../../../db/entities/dashboard.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class DashboardQueryService {
  private logger: Logger;

  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(DashboardQueryService.name);
  }

  public async getProjectDashboards(projectId: string): Promise<ApiResponse<Dashboard[]>> {
    try {
      const dashboards = await this.getListDto(projectId);
      // TODO: map for select options?

      return new ApiResponse("success", undefined, dashboards);
    } catch (err) {
      this.logger.error(`[${this.getProjectDashboards.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getListDto(
    id: string,
    manager: EntityManager = this.entityManager
  ): Promise<Dashboard[]> {
    return await manager.getRepository(Dashboard).find({
      where: {
        project: {
          id
        }
      }
    });
  }

  public async getDto(
    id: string,
    manager: EntityManager = this.entityManager
  ): Promise<Dashboard> {
    return await manager
      .getRepository(Dashboard)
      .createQueryBuilder("dashboard")
      .where("dashboard.id = :id", { id })
      .leftJoinAndSelect("dashboard.panels", "panels")
      .getOne();
  }

  public async getDashboard(id: string): Promise<ApiResponse<Dashboard>> {
    try {
      const dashboard = await this.getDto(id);

      // TODO: map dashboard panels?

      return new ApiResponse("success", undefined, dashboard);
    } catch (err) {
      this.logger.error(`[${this.getDashboard.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getDashboardPanelDto(panelId: string): Promise<DashboardPanel> {
    return await this.entityManager.getRepository(DashboardPanel).findOne({
      where: { id: panelId }
    });
  }

  public async getDashboardPanel(panelId: string): Promise<ApiResponse<DashboardPanel>> {
    try {
      const dashboardPanel = await this.getDashboardPanelDto(panelId);
      return new ApiResponse("success", undefined, dashboardPanel);
    } catch (err) {
      this.logger.error(`[${this.getDashboardPanels.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async getDashboardPanels(id: string): Promise<ApiResponse<DashboardPanel[]>> {
    try {
      const dashboardPanels = await this.entityManager.getRepository(DashboardPanel).find({
        where: {
          dashboard: {
            id
          }
        }
      });

      // TODO: do i need this endpoint?

      return new ApiResponse("success", undefined, dashboardPanels);
    } catch (err) {
      this.logger.error(`[${this.getDashboardPanels.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }
}
