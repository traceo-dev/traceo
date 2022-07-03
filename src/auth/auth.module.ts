import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountService } from 'src/account/account.service';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtStrategy } from './jwt.strategy';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AwrService } from 'src/application-account/awr.service';
import { AwrQueryService } from 'src/application-account/awr-query/awr-query.service';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { ReleaseQueryService } from 'src/release/query/release-query.service';
import { HttpModule } from "@nestjs/axios";

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
    MailingService, 
    JwtStrategy, 
    AccountQueryService, 
    ApplicationQueryService, 
    AwrService,
    AwrQueryService,
    AWSBucketService,
    ReleaseQueryService,
    // HttpService
  ],
  controllers: [AuthController]
})
export class AuthModule { }
