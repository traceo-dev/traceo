import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MailingService } from 'src/mailing/mailing.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AwrService } from 'src/application-account/awr.service';
import { AwrQueryService } from 'src/application-account/awr-query/awr-query.service';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    AuthModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AccountService, 
    MailingService, 
    AccountQueryService, 
    ApplicationQueryService, 
    AwrService, 
    AwrQueryService, 
    AWSBucketService,
    ReleaseQueryService
  ],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
