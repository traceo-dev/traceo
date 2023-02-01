import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PassportModule } from '@nestjs/passport';
import { AccountQueryService } from './account-query/account-query.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AmrService } from '../application-member/amr.service';
import { AmrQueryService } from '../application-member/amr-query/amr-query.service';
import { HttpModule } from "@nestjs/axios";
import { GuardsService } from "@common/guards/guards.service";
import { AccountsController } from './accounts.controller';
import { AuthTokenService } from 'src/auth/auth-token.service';
import { AuthModule } from 'src/auth/auth.module';

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
    AmrQueryService,
    GuardsService,
    AuthTokenService
  ],
  controllers: [
    AccountController,
    AccountsController
  ],
  exports: [
    AccountService,
    AccountQueryService
  ]
})
export class AccountModule { }