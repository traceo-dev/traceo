import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AuthModule } from 'lib/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { ApplicationQueryService } from 'lib/application/application-query/application-query.service';
import { AmrService } from 'lib/application-member/amr.service';
import { AmrQueryService } from 'lib/application-member/amr-query/amr-query.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    AuthModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AccountService,
    AccountQueryService,
    ApplicationQueryService,
    AmrService,
    AmrQueryService
  ],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
