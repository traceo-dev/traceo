import { Injectable } from '@nestjs/common';
import { RequestUser } from '../auth/auth.model';
import dateUtils from '../helpers/dateUtils';
import { CommentsGateway } from '../websockets/comments.gateway';
import { EntityManager } from 'typeorm';
import { Comment } from '../db/entities/comment.entity';
import { PatchCommentDto } from '../types/comments';

@Injectable()
export class CommentsService {
  constructor(
    private commentsGateway: CommentsGateway,
    private entityManager: EntityManager,
  ) { }

  public async getComments(incidentId: string): Promise<Comment[]> {
    return await this.entityManager
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .where('comment.incident = :incidentId', { incidentId })
      .leftJoin('comment.sender', 'sender')
      .addSelect(["sender.name", "sender.email", "sender.id", "sender.gravatar"])
      .getMany();
  }

  public async saveComment(
    comment: PatchCommentDto,
    account: RequestUser,
  ): Promise<void> {
    const { message, incidentId } = comment;
    const { id } = account;

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
  }

  public async updateComment(
    id: string,
    comment: PatchCommentDto,
  ): Promise<void> {
    const { incidentId, message } = comment;

    await this.entityManager.getRepository(Comment).update(
      { id },
      {
        message,
        lastUpdateAt: dateUtils.toUnix()
      },
    );

    this.commentsGateway.onUpdateComment(incidentId);
  }

  public async removeComment(id: string, incidentId: string): Promise<void> {
    await this.entityManager.getRepository(Comment).update(
      { id },
      {
        message: 'This message has been removed',
        removed: true,
        lastUpdateAt: dateUtils.toUnix()
      },
    );

    this.commentsGateway.onUpdateComment(incidentId);
  }
}
