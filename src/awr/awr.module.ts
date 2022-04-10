import { Module } from '@nestjs/common';
import { AwrService } from './awr.service';
import { AwrController } from './awr.controller';
import { AwrQueryService } from './awr-query/awr-query.service';
import { PassportModule } from '@nestjs/passport';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [AwrService, AwrQueryService, WorkspaceQueryService, AccountQueryService, MailingService],
  controllers: [AwrController]
})
export class AwrModule {}
