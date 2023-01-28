import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, IsEmail, IsBoolean, IsEnum } from "class-validator";
import { AccountStatus } from "@shared/enums/account.enum";

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

    // @IsEmail()
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

export class AccountCredentialsDto {
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'username' })
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
