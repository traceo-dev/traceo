import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateAccountDto } from 'lib/account/account.model';
import { Account } from 'lib/db/entities/account.entity';
import { AuthRequired } from 'lib/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'lib/libs/decorators/auth-user.decorator';
import {
  AccountCredentialsDto,
  RequestUser,
  UpdatePasswordDto
} from './auth.model';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get()
  @AuthRequired()
  async getString(@AuthAccount() account: Account): Promise<Account> {
    return account;
  }

  @Post('login')
  async login(@Body() user: AccountCredentialsDto): Promise<any> {
    return await this.authService.login(user);
  }

  @Post('check')
  async check(
    @Body() user: AccountCredentialsDto,
  ): Promise<{ isCorrect: boolean; account?: Account }> {
    return this.authService.checkCredentials(user);
  }

  @Post('update-password')
  @AuthRequired()
  async updatePassword(
    @Body() userPassword: UpdatePasswordDto,
    @AuthAccount() account: RequestUser,
  ): Promise<any> {
    return await this.authService.updateUserPassword(account, userPassword);
  }
}
