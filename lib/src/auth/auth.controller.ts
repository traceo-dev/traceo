import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthRequired } from "../common/decorators/auth-required.decorator";
import { UserCredentialsDto, UpdatePasswordDto } from "../common/types/dto/user.dto";
import { ApiResponse } from "../common/types/dto/response.dto";
import { AuthService, LoginResponseType } from "./auth.service";
import { Res, Req } from "@nestjs/common";
import { Response, Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() user: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ): Promise<ApiResponse<LoginResponseType>> {
    return await this.authService.login(user, res, req);
  }

  @Get("logout")
  @AuthRequired()
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ): Promise<ApiResponse<LoginResponseType>> {
    return await this.authService.logout(req, res);
  }

  @Post("check")
  @AuthRequired()
  async check(@Body() creds: UserCredentialsDto): Promise<ApiResponse<unknown>> {
    return this.authService.checkUserCredentials(creds);
  }

  @Post("update-password")
  @AuthRequired()
  async updatePassword(@Body() userPassword: UpdatePasswordDto): Promise<ApiResponse<unknown>> {
    return await this.authService.updateUserPassword(userPassword);
  }
}
