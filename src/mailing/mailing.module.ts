import { Module } from '@nestjs/common';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { MailingService } from './mailing.service';

@Module({
  imports: [],
  providers: [MailingService, ApplicationQueryService, ReleaseQueryService],
})
export class MailingModule {}
