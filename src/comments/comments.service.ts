import { Injectable } from '@nestjs/common';
import { PatchCommentDto } from 'src/db/models/comments';
import { RequestUser } from 'src/auth/auth.model';
import dateUtils from 'src/helpers/dateUtils';
import { CommentsGateway } from 'src/websockets/comments.gateway';
import { EntityManager } from 'typeorm';
import { Comment } from 'src/db/entities/comment.entity';
import { Account } from 'src/db/entities/account.entity';
import { Incident } from 'src/db/entities/incident.entity';
import { Workspace } from 'src/db/entities/workspace.entity';

@Injectable()
export class CommentsService {
    constructor(
        private commentsGateway: CommentsGateway,
        private entityManager: EntityManager
    ) { }

    public async getComments(
        incidentId: string,
    ): Promise<Comment[]> {
        return await this.entityManager.getRepository(Comment)
            .createQueryBuilder('comment')
            .where('comment.incident = :incidentId', { incidentId })
            .leftJoin('comment.sender', 'sender')
            .addSelect(["sender.name", "sender.email", "sender.id", "sender.logo"])
            .getMany();
    };

    public async saveComment(comment: PatchCommentDto, account: RequestUser): Promise<void> {
        const { message, incidentId } = comment;
        const { id } = account;

        try {
            await this.entityManager.transaction(async (manager) => {
                const sender = await manager.getRepository(Account).findOneByOrFail({ id });
                const incident = await manager.getRepository(Incident).findOneByOrFail({ id: incidentId })

                const comment: Comment = {
                    message: message,
                    sender,
                    removed: false,
                    createdAt: dateUtils.toUnix(),
                    incident
                }
                await manager.getRepository(Comment).save(comment);
                await manager.increment(Incident, { id: incidentId }, "commentsCount", 1);
            });

            this.commentsGateway.onNewComment(incidentId, comment);
        } catch (error) {
            throw error;
        }
    };

    public async updateComment(id: string, comment: PatchCommentDto): Promise<void> {
        const { incidentId, message } = comment;

        await this.entityManager.getRepository(Comment).update({ id }, {
            message,
            lastUpdateAt: dateUtils.toUnix()
        });

        this.commentsGateway.onUpdateComment(incidentId);
    }

    public async removeComment(id: string, incidentId: string): Promise<void> {
        await this.entityManager.getRepository(Comment).update({ id }, {
            message: 'This message has been removed',
            removed: true,
            lastUpdateAt: dateUtils.toUnix()
        });

        this.commentsGateway.onUpdateComment(incidentId);
    }
}
