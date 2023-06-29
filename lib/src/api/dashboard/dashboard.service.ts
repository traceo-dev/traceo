import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { DashboardPanel } from '../../db/entities/dashboard-panel.entity';
import { Dashboard } from '../../db/entities/dashboard.entity';
import { Project } from '../../db/entities/project.entity';
import { EntityManager } from 'typeorm';
import { ProjectQueryService } from '../project/project-query/project-query.service';
import { DashboardDto, DashboardPanelDto } from '../../common/types/dto/dashboard.dto';
import { DashboardQueryService } from './dashboard-query/dashboard-query.service';

/**
 * TODO: semaphors to crud operations on dashboards/panels
 */

@Injectable()
export class DashboardService {
    private logger: Logger;

    constructor(
        private readonly entityManager: EntityManager,
        private readonly projectQueryService: ProjectQueryService,
        private readonly dashboardQueryService: DashboardQueryService
    ) {
        this.logger = new Logger(DashboardService.name)
    }

    public async create(dto: DashboardDto, project: Project, manager: EntityManager = this.entityManager) {
        const dashboard: Partial<Dashboard> = {
            project,
            ...dto
        }
        return await this.entityManager.getRepository(Dashboard).save(dashboard);
    }

    public async createDashboard(dto: DashboardDto): Promise<ApiResponse<Dashboard>> {
        try {
            const project = await this.projectQueryService.getDto(dto.projectId);
            if (!project) {
                throw new BadRequestException("Project does not exists!");
            }

            const dashboard = await this.create(dto, project);

            return new ApiResponse("success", undefined, dashboard);
        } catch (err) {
            this.logger.error(`[${this.createDashboard.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    public async createPanel(dto: DashboardPanelDto): Promise<ApiResponse<DashboardPanel>> {
        try {
            const dashboard = await this.dashboardQueryService.getDto(dto.dashboardId);
            if (!dashboard) {
                throw new BadRequestException("Dashboard does not exists!");
            }

            const panel = await this.entityManager.getRepository(DashboardPanel).save({
                ...dto,
                dashboard
            });
            return new ApiResponse("success", undefined, panel);
        } catch (err) {
            this.logger.error(`[${this.createDashboard.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    public async updateDashboard(dto: DashboardDto): Promise<ApiResponse<DashboardPanel>> {
        try {
            const dashboard = await this.entityManager.getRepository(Dashboard).update({ id: dto.dashboardId }, dto);
            return new ApiResponse("success", undefined, dashboard);
        } catch (err) {
            this.logger.error(`[${this.updateDashboard.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    public async updatePanel(dto: DashboardPanelDto): Promise<ApiResponse<DashboardPanel>> {
        try {
            const dashboardPanel = await this.entityManager.getRepository(DashboardPanel).update({ id: dto.panelId }, dto);
            return new ApiResponse("success", undefined, dashboardPanel);
        } catch (err) {
            this.logger.error(`[${this.updatePanel.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
    }

    public async removeDashboard(dashboardId: string): Promise<ApiResponse<unknown>> {
        try {
            const dashboard = await this.dashboardQueryService.getDto(dashboardId);
            if (!dashboard) {
                throw new BadRequestException("Dashboard already deleted.");
            }

            await this.entityManager.getRepository(Dashboard).delete({
                id: dashboard.id
            });

            return new ApiResponse("success", undefined, undefined);
        } catch (err) {
            this.logger.error(`[${this.removeDashboard.name}] Caused by: ${err}`);
            return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
        }
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
