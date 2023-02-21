import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto, UserDto } from "../../common/types/dto/user.dto";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { IUser } from "@traceo/types";
import { AuthGuard } from "../../common/decorators/auth-guard.decorator";
import { UserService } from "./user.service";
import { UserQueryService } from "./user-query/user-query.service";

@ApiTags("user")
@Controller("user")
@UseGuards(new AuthGuard())
export class UserController {
  constructor(readonly userService: UserService, readonly queryService: UserQueryService) {}

  @Get()
  async getSignedInUser(): Promise<ApiResponse<IUser>> {
    return await this.queryService.getSignedInUser();
  }

  @Post("/new")
  async createUser(@Body() dto: CreateUserDto): Promise<ApiResponse<unknown>> {
    return this.userService.createUser(dto);
  }

  @Patch()
  async updateUser(@Body() dto: UserDto): Promise<ApiResponse<unknown>> {
    return await this.userService.updateUser(dto);
  }

  @Delete("/:id")
  public async deleteUser(@Param("id") id: string): Promise<ApiResponse<unknown>> {
    return await this.userService.deleteUser(id);
  }
}
