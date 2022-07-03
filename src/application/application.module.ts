import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AwrService } from 'src/application-account/awr.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from './application-query/application-query.service';
import { AwrQueryService } from 'src/application-account/awr-query/awr-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { ReleaseQueryService } from 'src/release/query/release-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [
    ApplicationService,
    AwrService,
    AwrQueryService,
    AccountQueryService,
    MailingService,
    ApplicationQueryService,
    AWSBucketService,
    ReleaseQueryService,
  ],
  controllers: [ApplicationController]
})
export class ApplicationModule { }
