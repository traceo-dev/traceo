import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MailingService } from 'src/mailing/mailing.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [AccountService, MailingService],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
