import { Module } from '@nestjs/common';
import { AwrService } from './awr.service';
import { AwrController } from './awr.controller';
import { AwrQueryService } from './awr-query/awr-query.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { ReleaseQueryService } from 'src/release/query/release-query.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AwrService, AwrQueryService, ApplicationQueryService, AccountQueryService, MailingService, ReleaseQueryService],
  controllers: [AwrController]
})
export class AwrModule {}
