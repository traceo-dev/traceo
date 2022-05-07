import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DeepPartial } from 'typeorm';
import { Comment } from "../db/entities/comment.entity";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CommentsGateway {

    @WebSocketServer()
    private server: Server;

    onNewComment(incidentId: string, comment: DeepPartial<Comment>) {
        this.server.to(incidentId).emit('new_comment', comment);
    }

    onUpdateComment(incidentId: string) {
        this.server.to(incidentId).emit('update_comment');
    }

    @SubscribeMessage('join_room')
    joinRoom(@MessageBody() id: string, @ConnectedSocket() socket: Socket): void {
        socket.join(id);
    }
}