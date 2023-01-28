import { Module } from '@nestjs/common';
import { IncidentCommentsService } from './incident-comments.service';
import { IncidentCommentsController } from './incident-comments.controller';
import { PassportModule } from '@nestjs/passport';
import { IncidentCommentsQueryService } from './query/incident-comments-query.service';
import { CommentsGateway } from '@common/websockets/comments.gateway';
import { WebsocketsModule } from '@common/websockets/websockets.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    WebsocketsModule
  ],
  providers: [
    IncidentCommentsService,
    IncidentCommentsQueryService,
    CommentsGateway
  ],
  controllers: [IncidentCommentsController],
  exports: [
    IncidentCommentsService,
    IncidentCommentsQueryService
  ]
})
export class IncidentCommentsModule { }
