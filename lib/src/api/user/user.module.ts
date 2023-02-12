import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { MemberService } from '../member/member.service';
import { MemberQueryService } from '../member/member-query/member-query.service';
import { HttpModule } from "@nestjs/axios";
import { AuthTokenService } from '../../auth/auth-token.service';
import { AuthModule } from '../../auth/auth.module';
import { UserService } from './user.service';
import { UserQueryService } from './user-query/user-query.service';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    UserService,
    UserQueryService,
    ApplicationQueryService,
    MemberService,
    MemberQueryService,
    AuthTokenService
  ],
  controllers: [
    UserController,
    UsersController
  ],
  exports: [
    UserService,
    UserQueryService
  ]
})
export class UserModule { }
