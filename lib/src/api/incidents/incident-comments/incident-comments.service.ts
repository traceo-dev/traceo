import { Injectable, Logger } from "@nestjs/common";
import { INTERNAL_SERVER_ERROR, REMOVED_MESSAGE_TEXT } from "../../../common/helpers/constants";
import dateUtils from "../../../common/helpers/dateUtils";
import { PatchCommentDto } from "../../../common/types/dto/comment.dto";
import { ApiResponse } from "../../../common/types/dto/response.dto";
import { EntityManager } from "typeorm";
import { Comment } from "../../../db/entities/comment.entity";
import { RequestContext } from "../../../common/middlewares/request-context/request-context.model";
import { LiveService } from "../../../common/services/live.service";
import { IComment } from "@traceo/types";

@Injectable()
export class IncidentCommentsService {
  private logger: Logger;
  constructor(private entityManager: EntityManager, private live: LiveService) {
    this.logger = new Logger(IncidentCommentsService.name);
  }

  public async saveComment(comment: PatchCommentDto): Promise<ApiResponse<unknown>> {
    const { message, incidentId, projectId } = comment;
    const { id } = RequestContext.user;

    try {
      const comment = await this.entityManager.getRepository(Comment).save({
        message: message,
        sender: {
          id
        },
        removed: false,
        createdAt: dateUtils.toUnix(),
        incident: {
          id: incidentId
        }
      });

      this.live.publish(projectId, {
        action: "new_comment",
        message: comment
      });

      return new ApiResponse("success", undefined);
    } catch (err) {
      this.logger.error(`[${this.saveComment.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateComment(
    id: string,
    comment: PatchCommentDto
  ): Promise<ApiResponse<unknown>> {
    const { message, projectId } = comment;

    return await this.entityManager
      .transaction(async (manager) => {
        await manager.getRepository(Comment).save({
          id,
          message,
          lastUpdateAt: dateUtils.toUnix()
        });

        const updatedComment = await this.getComment(id, manager);

        this.live.publish(projectId, {
          action: "update_comment",
          message: updatedComment
        });

        return new ApiResponse("success", undefined);
      })
      .catch((err) => {
        this.logger.error(`[${this.updateComment.name}] Caused by: ${err}`);
        return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
      });
  }

  public async removeComment(id: string, projectId: string): Promise<ApiResponse<unknown>> {
    return await this.entityManager
      .transaction(async (manager) => {
        await manager.getRepository(Comment).save({
          id,
          message: REMOVED_MESSAGE_TEXT,
          removed: true,
          lastUpdateAt: dateUtils.toUnix()
        });

        const updatedComment = await this.getComment(id, manager);
        this.live.publish(projectId, {
          action: "remove_comment",
          message: updatedComment
        });

        return new ApiResponse("success", undefined);
      })
      .catch((err) => {
        this.logger.error(`[${this.removeComment.name}] Caused by: ${err}`);
        return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
      });
  }

  private async getComment(
    id: string,
    manager: EntityManager = this.entityManager
  ): Promise<IComment> {
    return await manager
      .getRepository(Comment)
      .createQueryBuilder("comment")
      .where("comment.id = :id", { id })
      .leftJoin("comment.sender", "sender")
      .addSelect(["sender.name", "sender.email", "sender.id", "sender.gravatar"])
      .getOne();
  }
}
