import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface RequestUser {
  id: string;
  email: string;
  name: string;
}

export class AccountCredentialsDto {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'username' })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'password' })
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
