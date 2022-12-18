import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from "@nestjs/axios";
import { GuardsService } from '../common/guards/guards.service';
import { AccountService } from '../api/account/account.service';
import { AccountQueryService } from '../api/account/account-query/account-query.service';
import { AmrQueryService } from '../api/application-member/amr-query/amr-query.service';
import { AmrService } from '../api/application-member/amr.service';
import { ApplicationQueryService } from '../api/application/application-query/application-query.service';
import { JwtStrategy } from './jwt/jwt.strategy';

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
    GuardsService
  ],
  controllers: [AuthController]
})
export class AuthModule { }
