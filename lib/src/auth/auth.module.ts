import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from "@nestjs/axios";
import { UserService } from '../api/user/user.service';
import { UserQueryService } from '../api/user/user-query/user-query.service';
import { MemberQueryService } from '../api/member/member-query/member-query.service';
import { MemberService } from '../api/member/member.service';
import { ApplicationQueryService } from '../api/application/application-query/application-query.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthTokenService } from './auth-token.service';

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
    AuthTokenService,
    UserService,
    JwtStrategy,
    UserQueryService,
    ApplicationQueryService,
    MemberService,
    MemberQueryService
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    AuthTokenService
  ]
})
export class AuthModule { }
