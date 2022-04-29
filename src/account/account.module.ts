import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MailingService } from 'src/mailing/mailing.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { AwrService } from 'src/awr/awr.service';
import { AwrQueryService } from 'src/awr/awr-query/awr-query.service';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { MongodbModule } from 'src/db/mongodb.module';
import { ReleaseQueryService } from 'src/release/query/release-query.service';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongodbModule
  ],
  providers: [
    AccountService, 
    MailingService, 
    AccountQueryService, 
    WorkspaceQueryService, 
    AwrService, 
    AwrQueryService, 
    AWSBucketService,
    ReleaseQueryService
  ],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
