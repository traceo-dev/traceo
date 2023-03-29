import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

export type EventActionType = "update_comment" | "new_comment" | "remove_comment" | "log";

export type EventType = {
  message: object;
  action: EventActionType;
};

type SubscribeProjectType = {
  id: string;
};

@WebSocketGateway({
  cors: {
    origin: process.env.APP_ORIGIN
  }
})
export class LiveService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(LiveService.name);
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage("subscribe_project")
  public subscribe(
    @MessageBody() body: SubscribeProjectType,
    @ConnectedSocket() socket: Socket
  ): void {
    if (!body || !body.id) {
      throw new Error(`[${this.subscribe.name}] ID is required!`);
    }

    socket.join(`ws:${body.id}`);
  }

  @SubscribeMessage("leave_all_rooms")
  public leaveAllRooms(@MessageBody() _: unknown, @ConnectedSocket() socket: Socket): void {
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
  }

  public publish(projectId: string, data: EventType) {
    if (!projectId) {
      throw new Error(`[${this.publish.name}] Project id is required!`);
    }
    this.server.to(`ws:${projectId}`).emit(data.action, data.message);
  }
}
