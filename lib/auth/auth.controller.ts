import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAccount, RequestUser } from '../../lib/types/interfaces/account.interface';
import { AccountCredentialsDto, UpdatePasswordDto } from '../../lib/types/dto/account.dto';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { AuthService, LoginResponseType } from './auth.service';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() user: AccountCredentialsDto): Promise<ApiResponse<LoginResponseType>> {
    return await this.authService.login(user);
  }

  @Post('check')
  async check(
    @Body() creds: AccountCredentialsDto,
  ): Promise<ApiResponse<unknown>> {
    return this.authService.checkUserCredentials(creds);
  }

  @Post('update-password')
  @AuthRequired()
  async updatePassword(
    @Body() userPassword: UpdatePasswordDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    return await this.authService.updateUserPassword(account, userPassword);
  }
}
