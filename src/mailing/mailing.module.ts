import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/db/mongodb.module';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { MailingService } from './mailing.service';

@Module({
  imports: [MongodbModule],
  providers: [MailingService, WorkspaceQueryService, ReleaseQueryService],
})
export class MailingModule {}
