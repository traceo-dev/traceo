import { ApiOperation, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AccountRole, AccountStatus } from "src/db/entities/account.entity";

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'name' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  readonly password: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ type: String, description: 'email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'username' })
  public username?: string;
}

export class AccountDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account id' })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'username name' })
  username?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account email' })
  email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'account as admin' })
  isAdmin?: boolean;

  @IsEnum(AccountStatus)
  @IsOptional()
  @ApiProperty({ description: 'account status' })
  status: AccountStatus;
}