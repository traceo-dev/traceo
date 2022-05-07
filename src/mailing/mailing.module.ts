import { Module } from '@nestjs/common';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { MailingService } from './mailing.service';

@Module({
  imports: [],
  providers: [MailingService, WorkspaceQueryService, ReleaseQueryService],
})
export class MailingModule {}
