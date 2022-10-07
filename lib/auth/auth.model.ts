import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface RequestUser {
  id: string;
  email: string;
  name: string;
  logo: string;
}

export class AccountCredentialsDto {
  constructor(usernameOrEmail: string, password: string) {
    this.usernameOrEmail = usernameOrEmail;
    this.password = password;
  }

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'username or email' })
  readonly usernameOrEmail: string;

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
