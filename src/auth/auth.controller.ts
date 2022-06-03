import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from 'src/account/account.model';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { AccountCredentialsDto, RequestUser, UpdatePasswordDto } from './auth.model';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService
  ) { }

  @Get()
  @AuthRequired()
  async getString(@AuthAccount() account: Account): Promise<Account> {
    return account;
  }

  @Post('login')
  async login(
    @Body() user: AccountCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user);
  }

  @Post('check')
  async check(
    @Body() user: AccountCredentialsDto,
  ): Promise<{ isCorrect: boolean, account?: Account }> {
    return this.authService.checkCredentials(user);
  }

  @Post('register')
  async register(@Body() accountDto: CreateAccountDto): Promise<any> {
    return this.authService.register(accountDto);
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
