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
import { AccountPermissionService } from './account-permission/account-permission.service';
import { AccountPermissionModule } from './account-permission/account-permission.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    AccountPermissionModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AccountService,
    AccountQueryService,
    ApplicationQueryService,
    AmrService,
    AmrQueryService,
    AccountPermissionService
  ],
  controllers: [AccountController],
  exports: [AccountService, AccountPermissionService]
})
export class AccountModule { }
