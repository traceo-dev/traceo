import { Injectable } from "@nestjs/common";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { EnvType, ViewConfigData } from "@traceo/types";
import { EntityManager } from "typeorm";
import { SESSION_NAME, VERSION } from "../../common/helpers/constants";
import { Session } from "../../db/entities/session.entity";
import { UserQueryService } from "../user/user-query/user-query.service";
import { Request } from "express";

@Injectable()
export class ViewService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly userQueryService: UserQueryService
  ) {}

  public async getViewConfigData(req: Request): Promise<ApiResponse<ViewConfigData>> {
    const settings: Partial<ViewConfigData> = {};

    const isDemo = process.env.DEMO === "true";

    const sessionID = req.cookies[SESSION_NAME];
    if (sessionID) {
      const session = await this.entityManager.getRepository(Session).findOne({
        where: { sessionID }
      });

      if (session) {
        const userDto = await this.userQueryService.getDto(session.userID);
        settings.user = userDto;
      }
    }

    settings.env = process.env.NODE_ENV as EnvType;
    settings.demoMode = isDemo;
    settings.version = VERSION;

    return new ApiResponse("success", undefined, settings);
  }
}
