import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAccount, RequestUser } from '../../lib/types/interfaces/account.interface';
import { AccountCredentialsDto, UpdatePasswordDto } from '../../lib/types/dto/account.dto';
import { Account } from '../db/entities/account.entity';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { AuthService, CheckCredentialsType, LoginResponseType } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Get()
  @AuthRequired()
  async getString(@AuthAccount() account: Account): Promise<IAccount> {
    return account;
  }

  @Post('login')
  async login(@Body() user: AccountCredentialsDto): Promise<LoginResponseType> {
    return await this.authService.login(user);
  }

  @Post('check')
  async check(
    @Body() creds: AccountCredentialsDto,
  ): Promise<CheckCredentialsType> {
    return this.authService.checkCredentials(creds);
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
