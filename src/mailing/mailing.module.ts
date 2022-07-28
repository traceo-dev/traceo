import { Module } from '@nestjs/common';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { MailingService } from './mailing.service';

@Module({
  imports: [],
  providers: [MailingService, ApplicationQueryService],
})
export class MailingModule {}
