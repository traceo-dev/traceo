import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Module({
  providers: [MailingService],
})
export class MailingModule {}
