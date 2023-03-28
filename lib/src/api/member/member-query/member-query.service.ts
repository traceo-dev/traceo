import { Injectable, Logger } from "@nestjs/common";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { INTERNAL_SERVER_ERROR } from "../../../common/helpers/constants";
import { ApplicationDtoQuery } from "../../../common/types/dto/application.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { Member } from "../../../db/entities/member.entity";
import { EntityManager } from "typeorm";
import { RequestContext } from "../../../common/middlewares/request-context/request-context.model";

@Injectable()
export class MemberQueryService {
  private logger: Logger;
  constructor(private readonly entityManager: EntityManager) {
    this.logger = new Logger(MemberQueryService.name);
  }

  /**
   * Return pageable list of the members assigned to app
   *
   * @param appId
   * @param pageOptionsDto
   * @returns
   */
  public async getMembers(
    projectId: string,
    pageOptionsDto: BaseDtoQuery
  ): Promise<ApiResponse<Member[]>> {
    const { order, take, search, page } = pageOptionsDto;

    try {
      const queryBuilder = this.entityManager
        .getRepository(Member)
        .createQueryBuilder("member")
        .innerJoin("member.project", "project", "project.id = :projectId", { projectId })
        .leftJoin("member.user", "user");

      if (search) {
        queryBuilder.where("LOWER(user.name) LIKE LOWER(:name)", {
          name: `%${search}%`
        });
      }

      queryBuilder
        .addSelect(["user.name", "user.username", "user.email", "user.id", "user.gravatar"])
        .orderBy("member.createdAt", order, "NULLS LAST")
        .skip((page - 1) * take)
        .take(take);

      const members = await queryBuilder.getMany();
      const response = members.map(({ id, role, user, createdAt }) => ({
        createdAt,
        ...user,
        id,
        userId: user.id,
        role
      }));

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getMembers.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Return pageable list of the Apps assigned to user
   *
   * @param userId
   * @param pageOptionsDto
   * @returns
   */

  public async getUserApps(
    userId: string,
    pageOptionsDto: ApplicationDtoQuery
  ): Promise<ApiResponse<Member[]>> {
    const { page, take, order, search, sortBy } = pageOptionsDto;

    let id = userId;
    if (!userId) {
      id = RequestContext.user.id;
    }

    try {
      const queryBuilder = this.entityManager
        .getRepository(Member)
        .createQueryBuilder("member")
        .innerJoin("member.user", "user", "user.id = :userId", { userId: id })
        .leftJoinAndSelect("member.project", "project")
        .loadRelationCountAndMap("project.incidentsCount", "project.incidents")
        .leftJoin("project.owner", "owner");

      if (search) {
        queryBuilder
          .where("LOWER(project.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          })
          .orWhere("LOWER(owner.name) LIKE LOWER(:name)", {
            name: `%${search}%`
          });
      }

      const appsMember = await queryBuilder
        .addSelect(["owner.name", "owner.email", "owner.id", "owner.gravatar"])
        .orderBy(`project.${sortBy || "lastEventAt"}`, order, "NULLS LAST")
        .skip((page - 1) * take)
        .limit(take)
        .getMany();

      const response = appsMember.map((member) => ({
        ...member.project,
        id: member.id,
        appId: member.project.id,
        role: member.role
      }));

      return new ApiResponse("success", undefined, response);
    } catch (error) {
      this.logger.error(`[${this.getUserApps.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }

  public async memberExists(
    { userId, projectId }: { userId: string; projectId: string },
    manager: EntityManager = this.entityManager
  ): Promise<boolean> {
    const count = await manager
      .getRepository(Member)
      .createQueryBuilder("member")
      .where("member.user = :userId AND member.project = :projectId", {
        userId,
        projectId
      })
      .getCount();
    return count > 0;
  }

  public async getPermission(projectId: string): Promise<any> {
    const { id } = RequestContext.user;
    try {
      const applicationQuery = await this.entityManager
        .getRepository(Member)
        .createQueryBuilder("member")
        .where("member.project = :projectId", { projectId })
        .innerJoin("member.user", "user", "user.id = :id", { id })
        .getOne();

      if (!applicationQuery) {
        return new ApiResponse("error", undefined, "No permissions for this project!");
      }

      return new ApiResponse("success", undefined, {
        role: applicationQuery.role
      });
    } catch (error) {
      this.logger.error(`[${this.getPermission.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR);
    }
  }
}
