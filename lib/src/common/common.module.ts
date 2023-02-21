import { Module } from "@nestjs/common";
import { CommentsGateway } from "./websockets/comments.gateway";
import { WebsocketsModule } from "./websockets/websockets.module";

@Module({
  imports: [WebsocketsModule],
  providers: [CommentsGateway]
})
export class CommonModule {}
