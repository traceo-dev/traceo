import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { COLLECTION, MONGODB_CONNECTION } from 'src/db/mongodb.module';
import { Comment, CommentDto } from 'src/db/documents/comments';
import { mongoDbUtils } from 'src/helpers/mongodb';
import { RequestUser } from 'src/auth/auth.model';
import dateUtils from 'src/helpers/dateUtils';

@Injectable()
export class CommentsService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private db: Db
    ) { }

    public async getComments(
        incidentId: string,
    ): Promise<Comment[]> {
        try {
            const documentQuery = await this.db
                .collection(COLLECTION.INCIDENTS)
                .aggregate([
                    { $match: { _id: new ObjectId(incidentId) } },
                    { $unwind: "$comments" },
                    { $sort: { "comments.createdAt": -1 } },
                    {
                        $project: {
                            message: "$comments.message",
                            _id: "$comments._id",
                            sender: "$comments.sender",
                            createdAt: "$comments.createdAt",
                            removed: "$comments.removed",
                        },
                    },
                ])
                .toArray();

            const documents = mongoDbUtils.getDocuments<Comment>(documentQuery);
            return documents;;
        } catch (error) {
            throw error;
        }
    };

    public async saveMessage(comment: CommentDto, account: RequestUser): Promise<void> {
        const { message, incidentId, workspaceId } = comment;
        const { email, id, name, logo } = account;

        try {
            const comment: Comment = {
                message: message,
                sender: {
                    _id: id,
                    name,
                    email,
                    logo
                },
                removed: false,
                createdAt: dateUtils.toUnix(),
            };

            await this.db.collection(COLLECTION.INCIDENTS).updateOne(
                { _id: new ObjectId(incidentId), projectId: workspaceId },
                {
                    $addToSet: {
                        comments: {
                            _id: new ObjectId(),
                            ...comment,
                        },
                    },
                    $set: {
                        lastMessageAt: dateUtils.toUnix(),
                    },
                    $inc: {
                        commentsCount: 1
                    }
                }
            );

            // await webSocketService.emitMessage(chatId, msg);
        } catch (error) {
            throw error;
        }
    };
}
