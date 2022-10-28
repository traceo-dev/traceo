import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AmrService } from '../application-member/amr.service';
import { AmrQueryService } from '../application-member/amr-query/amr-query.service';
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
