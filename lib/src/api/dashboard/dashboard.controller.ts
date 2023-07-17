import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { DashboardQueryService } from "./dashboard-query/dashboard-query.service";
import { DashboardService } from "./dashboard.service";
import { Dashboard } from "../../db/entities/dashboard.entity";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { DashboardPanel } from "../../db/entities/dashboard-panel.entity";
import {
  DashboardDto,
  DashboardPanelDto,
  LayoutChangeDto
} from "../../common/types/dto/dashboard.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("dashboard")
@Controller("dashboard")
@UseGuards(new AuthGuard())
export class DashboardController {
  constructor(
    private readonly dashboardQueryService: DashboardQueryService,
    private readonly dashboardService: DashboardService
  ) {}

  @Get("/:id")
  private async getDashboard(@Param("id") id: string): Promise<ApiResponse<Dashboard>> {
    return await this.dashboardQueryService.getDashboard(id);
  }

  // TODO: do i need this endpoint?
  @Get("/:id/panels")
  private async getDashboardPanels(@Param("id") id: string): Promise<ApiResponse<Dashboard>> {
    return await this.dashboardQueryService.getDashboardPanels(id);
  }

  @Get("/panel/:id")
  private async getDashboardPanel(@Param("id") id: string): Promise<ApiResponse<DashboardPanel>> {
    return await this.dashboardQueryService.getDashboardPanel(id);
  }

  @Get("/project/:id")
  private async getProjectDashboards(
    @Param("id") id: string
  ): Promise<ApiResponse<DashboardPanel>> {
    return await this.dashboardQueryService.getProjectDashboards(id);
  }

  //  //  //  //

  @Post()
  private async createDashboard(@Body() body: DashboardDto): Promise<ApiResponse<string>> {
    return await this.dashboardService.createDashboard(body);
  }

  @Post("/panel")
  private async createDashboardPanel(
    @Body() body: DashboardPanelDto
  ): Promise<ApiResponse<string>> {
    return await this.dashboardService.createPanel(body);
  }

  //  //  //  //

  @Patch()
  private async updateDashboard(@Body() body: DashboardDto): Promise<ApiResponse<string>> {
    return await this.dashboardService.updateDashboard(body);
  }

  @Patch("/panel")
  private async updatePanel(@Body() body: DashboardPanelDto): Promise<ApiResponse<string>> {
    return await this.dashboardService.updatePanel(body);
  }

  @Patch("/layout")
  private async updateDashboardLayout(
    @Body() body: LayoutChangeDto
  ): Promise<ApiResponse<string>> {
    return await this.dashboardService.updateDashboardLayout(body);
  }

  //  //  //  //

  @Delete()
  private async removeDashboard(
    @Query("dashboardId") dashboardId: string,
    @Query("projectId") projectId: string
  ): Promise<ApiResponse<string>> {
    return await this.dashboardService.removeDashboard(dashboardId, projectId);
  }

  @Delete("/panel/:id")
  private async removePanel(@Param("id") id: string): Promise<ApiResponse<string>> {
    return await this.dashboardService.removePanel(id);
  }
}
