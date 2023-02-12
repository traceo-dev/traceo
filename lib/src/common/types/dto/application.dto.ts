import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ApplicationTechnology } from "@traceo/types";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from "class-validator";
import { BaseDtoQuery } from "../../base/query/base-query.model";
import { BaseDataSourceDto } from "./data-source";

export class ApplicationDtoQuery extends BaseDtoQuery { }

export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "name" })
    public name: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional({ description: "technology" })
    public technology: ApplicationTechnology;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseDataSourceDto)
    public tsdbConfiguration: BaseDataSourceDto;
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
