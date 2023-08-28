import { Injectable, Logger } from "@nestjs/common";
import { EntityManager } from "typeorm";
import * as crypto from "crypto";
import { ProjectQueryService } from "./project-query/project-query.service";
import { UserQueryService } from "../user/user-query/user-query.service";
import { INTERNAL_SERVER_ERROR } from "../../common/helpers/constants";
import dateUtils from "../../common/helpers/dateUtils";
import { CreateProjectDto, ProjectDto } from "../../common/types/dto/project.dto";
import { Project } from "../../db/entities/project.entity";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { UserStatus } from "@traceo/types";
import { RequestContext } from "../../common/middlewares/request-context/request-context.model";
import { ProjectFactory } from "./project.factory";

@Injectable()
export class ProjectService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly projectQueryService: ProjectQueryService,
    private readonly userQueryService: UserQueryService,
    private readonly projectFactory: ProjectFactory
  ) {
    this.logger = new Logger(ProjectService.name);
  }

  public async create(dto: CreateProjectDto): Promise<ApiResponse<Project>> {
    const { id } = RequestContext.user;

    return this.entityManager
      .transaction(async (manager) => {
        const isExists = await this.projectQueryService.getDtoBy({ name: dto.name });
        if (isExists) {
          return new ApiResponse("error", undefined, {
            error: "Project with this name already exists"
          });
        }

        const user = await this.userQueryService.getDtoBy({ id });
        if (!user || [UserStatus.DISABLED, UserStatus.INACTIVE].includes(user.status)) {
          throw new Error(INTERNAL_SERVER_ERROR);
        }

        const project = await this.projectFactory.create(user, dto, manager);
        if (!project) {
          return new ApiResponse("error", "Error while creating the project. Please try again later.", undefined);
        }

        return new ApiResponse("success", "Project successfully created", {
          redirectUrl: `/project/${project.id}/dashboard/${project.mainDashboardId}`,
          id: project.id
        });
      })
      .catch((err: Error) => {
        this.logger.error(`[${this.create.name}] Caused by: ${err}`);
        return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
      });
  }

  public async generateApiKey(id: string): Promise<ApiResponse<string>> {
    const apiKey = `tr_${crypto.randomUUID()}`;
    try {
      await this.update(id, { apiKey });
      return new ApiResponse("success", "API Key Generated.", apiKey);
    } catch (err) {
      this.logger.error(`[${this.generateApiKey.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async removeApiKey(id: string): Promise<ApiResponse<unknown>> {
    try {
      await this.update(id, { apiKey: null });
      return new ApiResponse("success", "API Key Removed.");
    } catch (err) {
      this.logger.error(`[${this.removeApiKey.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async update(
    id: string,
    update: Partial<Project>,
    manager: EntityManager = this.entityManager
  ): Promise<void> {
    await manager.getRepository(Project).update(
      { id },
      {
        updatedAt: dateUtils.toUnix(),
        ...update
      }
    );
  }

  public async updateProject(projectBody: ProjectDto | Partial<Project>) {
    const { id, ...rest } = projectBody;

    try {
      await this.update(id, rest);
      return new ApiResponse("success", "Project updated");
    } catch (err) {
      this.logger.error(`[${this.update.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async delete(projectId: string): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManager
        .getRepository(Project)
        .createQueryBuilder("project")
        .where("project.id = :projectId", { projectId })
        .delete()
        .execute();

      return new ApiResponse("success", "Project removed");
    } catch (err) {
      this.logger.error(`[${this.delete.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }
}
