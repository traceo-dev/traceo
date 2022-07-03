import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Environment } from "src/db/models/release";

export class CreateApplicationBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name' })
    public name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'aboutDescription' })
    public aboutDescription: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'framework' })
    public framework: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'technology' })
    public technology: string;
}

export class ApplicationBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'app id' })
    public id?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'app name' })
    public name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'app logo url' })
    public logo?: string;

    @IsString()
    @IsOptional()
    @MaxLength(256)
    @ApiProperty({ description: 'app about description' })
    public aboutDescription?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'app default env' })
    public defaultEnv?: Environment;
}