import { Injectable, Logger } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR, REMOVED_MESSAGE_TEXT } from '../../../common/helpers/constants';
import dateUtils from '../../../common/helpers/dateUtils';
import { PatchCommentDto } from '../../../common/types/dto/comment.dto';
import { ApiResponse } from '../../../common/types/dto/response.dto';
import { RequestUser } from '../../../common/types/interfaces/account.interface';
import { CommentsGateway } from '../../../common/websockets/comments.gateway';
import { EntityManager } from 'typeorm';
import { Comment } from "../../../db/entities/comment.entity";

@Injectable()
export class IncidentCommentsService {
  private logger: Logger;
  constructor(
    private commentsGateway: CommentsGateway,
    private entityManager: EntityManager,
  ) {
    this.logger = new Logger(IncidentCommentsService.name);
  }

  public async saveComment(
    comment: PatchCommentDto,
    account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    const { message, incidentId } = comment;
    const { id } = account;

    try {
      await this.entityManager.getRepository(Comment).save({
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

      this.commentsGateway.onNewComment(incidentId);

      return new ApiResponse("success", "Comment has been sent");
    } catch (err) {
      this.logger.error(`[${this.saveComment.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async updateComment(
    id: string,
    comment: PatchCommentDto,
  ): Promise<ApiResponse<unknown>> {
    const { incidentId, message } = comment;

    try {
      await this.entityManager.getRepository(Comment).update(
        { id },
        {
          message,
          lastUpdateAt: dateUtils.toUnix()
        },
      );

      this.commentsGateway.onUpdateComment(incidentId);

      return new ApiResponse("success", "Comment updated");
    } catch (err) {
      this.logger.error(`[${this.updateComment.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async removeComment(id: string, incidentId: string): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManager.getRepository(Comment).update(
        { id },
        {
          message: REMOVED_MESSAGE_TEXT,
          removed: true,
          lastUpdateAt: dateUtils.toUnix()
        },
      );

      this.commentsGateway.onUpdateComment(incidentId);

      return new ApiResponse("success", "Comment removed")
    } catch (err) {
      this.logger.error(`[${this.removeComment.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }
}
