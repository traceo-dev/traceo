import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsEmail, IsBoolean, IsEnum } from "class-validator";
import { UserStatus } from "@traceo/types";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: "name" })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: "password" })
  readonly password: string;

  @IsOptional()
  // @IsEmail()
  @ApiPropertyOptional({ type: String, description: "email" })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "username" })
  public username?: string;
}

export class UserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: "user id" })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: "user name" })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: "username name" })
  username?: string;

  // @IsEmail()
  @IsOptional()
  @ApiProperty({ type: String, description: "user email" })
  email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: "user as admin" })
  isAdmin?: boolean;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiProperty({ description: "user status" })
  status: UserStatus;
}

export class UserCredentialsDto {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  @IsNotEmpty()
  @ApiPropertyOptional({ type: String, description: "username" })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: "password" })
  readonly password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "password" })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "newPassword" })
  readonly newPassword: string;
}
