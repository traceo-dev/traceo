import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber, MaxLength } from "class-validator";
import { BaseDtoQuery } from "../../../lib/core/query/generic.model";

export class ApplicationDtoQuery extends BaseDtoQuery { }

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "name" })
    public name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "aboutDescription" })
    public aboutDescription: string;
}

export class ApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "app id" })
    public id?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "app name" })
    public name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "app logo url" })
    public logo?: string;

    @IsString()
    @IsOptional()
    @MaxLength(256)
    @ApiProperty({ description: "app about description" })
    public aboutDescription?: string;
}
