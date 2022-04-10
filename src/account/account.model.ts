import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, description: 'name' })
    readonly name: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })
    @ApiProperty({ type: String, description: 'password' })
    readonly password: string;
  
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, description: 'email' })
    readonly email: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, description: 'workspace identifier' })
    public wid?: string;
}

export class AccountDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account id' })
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'account url logo' })
  logo?: string;
}