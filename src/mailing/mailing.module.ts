import { Module } from '@nestjs/common';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { MailingService } from './mailing.service';

@Module({
  providers: [MailingService, WorkspaceQueryService],
})
export class MailingModule {}
