import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PassportModule } from '@nestjs/passport';
import { WebsocketsModule } from '../websockets/websockets.module';
import { CommentsGateway } from '../websockets/comments.gateway';
import { CommentsQueryService } from './query/comments-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    WebsocketsModule
  ],
  providers: [CommentsService, CommentsQueryService, CommentsGateway],
  controllers: [CommentsController]
})
export class CommentsModule {}
