import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { AwrService } from 'src/awr/awr.service';
import { PassportModule } from '@nestjs/passport';
import { WorkspaceQueryService } from './workspace-query/workspace-query.service';
import { AwrQueryService } from 'src/awr/awr-query/awr-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { AcrService } from 'src/acr/acr.service';
import { ClusterService } from 'src/cluster/cluster.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [
    WorkspaceService,
    AwrService,
    AwrQueryService,
    AccountQueryService,
    MailingService,
    WorkspaceQueryService,
    AWSBucketService,
    ReleaseQueryService,
    AcrService,
    ClusterService
  ],
  controllers: [WorkspaceController]
})
export class WorkspaceModule { }
