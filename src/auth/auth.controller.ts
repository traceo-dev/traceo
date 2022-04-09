import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CreateAccountDto } from 'src/account/account.model';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/middlewares/auth-required.decorator';
import { AuthAccount } from 'src/middlewares/auth-user.decorator';
import { AccountCredentialsDto, RequestUser, UpdatePasswordDto } from './auth.model';
import { AuthService } from './auth.service';

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
  ): Promise<any> {
    return this.authService.login(user);
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
