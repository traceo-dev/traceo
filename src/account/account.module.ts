import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MailingService } from 'src/mailing/mailing.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AmrService } from 'src/application-member/amr.service';
import { AmrQueryService } from 'src/application-member/amr-query/amr-query.service';
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
    AmrService, 
    AmrQueryService
  ],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
