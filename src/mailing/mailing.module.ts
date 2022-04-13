import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/db/mongodb.module';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { MailingService } from './mailing.service';

@Module({
  imports: [MongodbModule],
  providers: [MailingService, WorkspaceQueryService],
})
export class MailingModule {}
