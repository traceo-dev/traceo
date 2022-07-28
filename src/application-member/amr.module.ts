import { Module } from '@nestjs/common';
import { AmrService } from './amr.service';
import { AmrController } from './amr.controller';
import { AmrQueryService } from './amr-query/amr-query.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AmrService, AmrQueryService, ApplicationQueryService, AccountQueryService, MailingService],
  controllers: [AmrController]
})
export class AmrModule {}
