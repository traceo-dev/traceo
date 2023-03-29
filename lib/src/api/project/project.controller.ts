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
import { ApiTags } from "@nestjs/swagger";
import { BaseDtoQuery } from "../../common/base/query/base-query.model";
import { CreateProjectDto, ProjectDto } from "../../common/types/dto/project.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IProject, ILog, LogsQuery } from "@traceo/types";
import { ProjectQueryService } from "./project-query/project-query.service";
import { ProjectService } from "./project.service";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("project")
@Controller("project")
@UseGuards(new AuthGuard())
export class ProjectController {
  constructor(
    readonly projectService: ProjectService,
    readonly projectQueryService: ProjectQueryService
  ) {}

  @Get()
  async getProject(@Query("id") id: string): Promise<ApiResponse<IProject>> {
    return await this.projectQueryService.getApiDto(id);
  }

  @Get("/all")
  async getProjects(@Query() query: BaseDtoQuery): Promise<ApiResponse<IProject[]>> {
    return await this.projectQueryService.getApiListDto(query);
  }

  @Get("/logs")
  async getProjectLogs(@Query() query: LogsQuery): Promise<ApiResponse<ILog[]>> {
    return await this.projectQueryService.getProjectLogs({ ...query });
  }

  @Post()
  async createProject(
    @Body() body: CreateProjectDto
  ): Promise<ApiResponse<IProject>> {
    return await this.projectService.create(body);
  }

  @Patch()
  async updateProject(@Body() body: ProjectDto): Promise<ApiResponse<unknown>> {
    return await this.projectService.updateProject(body);
  }

  @Post("/api-key/generate/:id")
  async generateApiKey(@Param("id") id: string): Promise<ApiResponse<unknown>> {
    return await this.projectService.generateApiKey(id);
  }

  @Delete("/api-key/remove/:id")
  async removeApiKey(@Param("id") id: string): Promise<ApiResponse<unknown>> {
    return await this.projectService.removeApiKey(id);
  }

  @Delete("/:id")
  public async deleteProject(@Param("id") id: string): Promise<ApiResponse<unknown>> {
    return await this.projectService.delete(id);
  }
}
