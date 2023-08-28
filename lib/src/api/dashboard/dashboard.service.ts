import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR } from "../../common/helpers/constants";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { DashboardPanel } from "../../db/entities/dashboard-panel.entity";
import { Dashboard } from "../../db/entities/dashboard.entity";
import { Project } from "../../db/entities/project.entity";
import { EntityManager } from "typeorm";
import { ProjectQueryService } from "../project/project-query/project-query.service";
import {
  DashboardDto,
  DashboardPanelDto,
  LayoutChangeDto
} from "../../common/types/dto/dashboard.dto";
import { DashboardQueryService } from "./dashboard-query/dashboard-query.service";
import dateUtils from "../../common/helpers/dateUtils";
import { DashboardPanel as DashboardPanelType, MemberRole } from "@traceo/types";
import { RequestContext } from "../../common/middlewares/request-context/request-context.model";
import { MemberQueryService } from "../member/member-query/member-query.service";

/**
 * TODO: semaphors to crud operations on dashboards/panels
 */

@Injectable()
export class DashboardService {
  private logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly projectQueryService: ProjectQueryService,
    private readonly dashboardQueryService: DashboardQueryService,
    private readonly memberQueryService: MemberQueryService
  ) {
    this.logger = new Logger(DashboardService.name);
  }

  public async create(
    dto: DashboardDto,
    project: Project,
    manager: EntityManager = this.entityManager
  ) {
    const unix = dateUtils.toUnix();
    return await manager.getRepository(Dashboard).save({
      project,
      isEditable: true,
      createdAt: unix,
      updatedAt: unix,
      ...dto
    });
  }

  public async createDashboard(dto: DashboardDto): Promise<ApiResponse<Dashboard>> {
    try {
      const project = await this.projectQueryService.getDto(dto.projectId);
      if (!project) {
        throw new BadRequestException("Project does not exists!");
      }

      const dashboard = await this.create(dto, project);

      return new ApiResponse("success", undefined, {
        id: dashboard.id
      });
    } catch (err) {
      this.logger.error(`[${this.createDashboard.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async batchCreatePanels(
    panels: DashboardPanelType[],
    manager: EntityManager = this.entityManager
  ) {
    return await manager
      .createQueryBuilder()
      .insert()
      .into(DashboardPanel)
      .values(panels)
      .execute();
  }

  public async createPanel(dto: DashboardPanelDto): Promise<ApiResponse<DashboardPanel>> {
    try {
      const dashboard = await this.dashboardQueryService.getDto(dto.dashboardId);
      if (!dashboard) {
        throw new BadRequestException("Dashboard does not exists!");
      }

      const panel = await this.entityManager.getRepository(DashboardPanel).save({
        ...dto,
        dashboard,
        createdAt: dateUtils.toUnix()
      });
      return new ApiResponse("success", undefined, panel);
    } catch (err) {
      this.logger.error(`[${this.createDashboard.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateDashboard(dto: DashboardDto): Promise<ApiResponse<DashboardPanel>> {
    try {
      const { dashboardId, projectId, ...rest } = dto;
      const dashboard = await this.entityManager
        .getRepository(Dashboard)
        .update({ id: dashboardId }, {
          ...rest,
          updatedAt: dateUtils.toUnix()
        });
      return new ApiResponse("success", undefined, dashboard);
    } catch (err) {
      this.logger.error(`[${this.updateDashboard.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updatePanel(dto: DashboardPanelDto): Promise<ApiResponse<DashboardPanel>> {
    try {
      const { panelId, dashboardId, ...rest } = dto;
      const dashboardPanel = await this.entityManager
        .getRepository(DashboardPanel)
        .update({ id: panelId }, rest);
      return new ApiResponse("success", undefined, dashboardPanel);
    } catch (err) {
      this.logger.error(`[${this.updatePanel.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateDashboardLayout(dto: LayoutChangeDto): Promise<ApiResponse<unknown>> {
    const { id } = RequestContext.user;
    if (!id) {
      return;
    }

    return await this.entityManager
      .transaction(async (manager) => {
        const permission = await this.memberQueryService.getProjectPermission(
          id,
          dto.projectId,
          manager
        );

        const isViewerPermission = [MemberRole.VIEWER].includes(permission);
        if (isViewerPermission) {
          return;
        }

        const dashboard = await this.dashboardQueryService.getDto(dto.dashboardId, manager);
        if (!dashboard.isEditable) {
          return;
        }

        // TODO: make as single query in raw sql
        for (const position of dto.positions) {
          await this.entityManager.getRepository(DashboardPanel).update(
            { id: position.i },
            {
              gridPosition: position
            }
          );
        }
        return new ApiResponse("success", undefined, undefined);
      })
      .catch((err) => {
        this.logger.error(`[${this.updateDashboardLayout.name}] Caused by: ${err}`);
        return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
      });
  }

  public async removeDashboard(
    dashboardId: string,
    projectId: string
  ): Promise<ApiResponse<unknown>> {
    return await this.entityManager
      .transaction(async (manager) => {
        const dashboard = await this.dashboardQueryService.getDto(dashboardId, manager);
        if (!dashboard) {
          throw new BadRequestException("Dashboard already deleted.");
        }

        if (dashboard.isBase) {
          return new ApiResponse("error", "Base dashboard cannot be removed.", undefined);
        }

        const project = await manager.getRepository(Project).findOneBy({ id: projectId });
        let mainDashboardId = project.mainDashboardId;
        if (project.mainDashboardId === dashboardId) {
          const dashboards = await this.dashboardQueryService.getListDto(projectId, manager);
          const availableDashboards = dashboards.filter((e) => e.id !== dashboardId);
          mainDashboardId = availableDashboards[0].id;

          await manager.getRepository(Project).update(
            { id: project.id },
            {
              updatedAt: dateUtils.toUnix(),
              mainDashboardId
            }
          );
        }

        await manager.getRepository(Dashboard).delete({
          id: dashboard.id
        });

        return new ApiResponse("success", "Dashboard removed.", {
          redirectUrl: `/project/${project.id}/dashboard/${mainDashboardId}`
        });
      })
      .catch((err) => {
        this.logger.error(`[${this.removeDashboard.name}] Caused by: ${err}`);
        return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
      });
  }

  public async removePanel(panelId: string): Promise<ApiResponse<unknown>> {
    try {
      const dashboardPanel = await this.dashboardQueryService.getDashboardPanelDto(panelId);
      if (!dashboardPanel) {
        throw new BadRequestException("Dashboard panel already deleted.");
      }

      await this.entityManager.getRepository(DashboardPanel).delete({
        id: dashboardPanel.id
      });

      return new ApiResponse("success", undefined, dashboardPanel);
    } catch (err) {
      this.logger.error(`[${this.removePanel.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }
}
