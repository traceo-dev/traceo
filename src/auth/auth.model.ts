import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface RequestUser {
    id: string;
    email: string;
    name: string;
    logo: string;
}

export class AccountCredentialsDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;
}

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'password' })
    readonly password: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'newPassword' })
    readonly newPassword: string;
}