import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseDtoQuery } from "../../common/base/query/base-query.model";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IProject } from "@traceo/types";
import { ProjectQueryService } from "./project-query/project-query.service";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";

@ApiTags("projects")
@Controller("projects")
@UseGuards(new AuthGuard())
export class ProjectsController {
  constructor(readonly projectQueryService: ProjectQueryService) {}

  @Get("/search")
  async getProjects(@Query() query: BaseDtoQuery): Promise<ApiResponse<IProject[]>> {
    return await this.projectQueryService.getApiListDto(query);
  }
}
