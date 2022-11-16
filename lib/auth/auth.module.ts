import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountService } from '../account/account.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AccountQueryService } from '../account/account-query/account-query.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AmrService } from '../application-member/amr.service';
import { AmrQueryService } from '../application-member/amr-query/amr-query.service';
import { HttpModule } from "@nestjs/axios";
import { AccountPermissionService } from '../../lib/account/account-permission/account-permission.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule
  ],
  providers: [
    AuthService,
    AccountService,
    JwtStrategy,
    AccountQueryService,
    ApplicationQueryService,
    AmrService,
    AmrQueryService,
    AccountPermissionService
  ],
  controllers: [AuthController]
})
export class AuthModule { }
