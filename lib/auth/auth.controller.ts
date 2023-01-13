import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequired } from '../common/decorators/auth-required.decorator';
import { AuthAccount } from '../common/decorators/auth-user.decorator';
import { AccountCredentialsDto, UpdatePasswordDto } from '../common/types/dto/account.dto';
import { ApiResponse } from '../common/types/dto/response.dto';
import { RequestUser } from '../common/types/interfaces/account.interface';
import { AuthService, LoginResponseType } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() user: AccountCredentialsDto): Promise<ApiResponse<LoginResponseType>> {
    return await this.authService.login(user);
  }

  @Post('check')
  @AuthRequired()
  async check(
    @Body() creds: AccountCredentialsDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    return this.authService.checkUserCredentials(account, creds);
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
