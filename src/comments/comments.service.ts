import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { COLLECTION, MONGODB_CONNECTION } from 'src/db/mongodb.module';
import { Comment, CommentDto, PatchCommentDto } from 'src/db/documents/comments';
import { mongoDbUtils } from 'src/helpers/mongodb';
import { RequestUser } from 'src/auth/auth.model';
import dateUtils from 'src/helpers/dateUtils';
import { CommentsGateway } from 'src/websockets/comments.gateway';

@Injectable()
export class CommentsService {
    constructor(
        @Inject(MONGODB_CONNECTION)
        private db: Db,
        private commentsGateway: CommentsGateway
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
                            lastUpdateAt: "$comments.lastUpdateAt"
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

    public async saveComment(comment: PatchCommentDto, account: RequestUser): Promise<void> {
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
                { _id: new ObjectId(incidentId), appId: workspaceId },
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

            this.commentsGateway.onNewComment(incidentId, comment);
        } catch (error) {
            throw error;
        }
    };

    public async updateComment(commentId: string, comment: PatchCommentDto): Promise<void> {
        const { incidentId, message, workspaceId } = comment;

        try {
            await this.db.collection(COLLECTION.INCIDENTS).findOneAndUpdate(
                {
                    _id: new ObjectId(incidentId),
                    appId: workspaceId,
                    "comments._id": new ObjectId(commentId),
                },
                {
                    $set: {
                        "comments.$.message": message,
                        "comments.$.lastUpdateAt": dateUtils.toUnix(),
                    },
                }
            );

            this.commentsGateway.onUpdateComment(incidentId);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async removeComment(commentId: string, comment: CommentDto): Promise<void> {
        const { incidentId, workspaceId } = comment;

        try {
            await this.db.collection(COLLECTION.INCIDENTS).findOneAndUpdate(
                {
                    _id: new ObjectId(incidentId),
                    appId: workspaceId,
                    "comments._id": new ObjectId(commentId),
                },
                {
                    $set: {
                        "comments.$.message": 'This message has been removed.',
                        "comments.$.removed": true,
                        "comments.$.lastUpdateAt": dateUtils.toUnix()
                    },
                }
            );

            this.commentsGateway.onUpdateComment(incidentId);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}
