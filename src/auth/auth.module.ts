import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountService } from 'src/account/account.service';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Account]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [AuthService, AccountService, MailingService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
