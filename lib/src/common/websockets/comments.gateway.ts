import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.APP_ORIGIN
  }
})
export class CommentsGateway {
  @WebSocketServer()
  private server: Server;

  onNewComment(incidentId: string) {
    this.server.to(incidentId).emit("new_comment");
  }

  onUpdateComment(incidentId: string) {
    this.server.to(incidentId).emit("update_comment");
  }

  @SubscribeMessage("join_room")
  joinRoom(@MessageBody() id: string, @ConnectedSocket() socket: Socket): void {
    socket.join(id);
  }
}
