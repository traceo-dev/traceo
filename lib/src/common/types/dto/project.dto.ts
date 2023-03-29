import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SDK } from "@traceo/types";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from "class-validator";
import { BaseDtoQuery } from "../../base/query/base-query.model";

export class ProjectDtoQuery extends BaseDtoQuery {}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "name" })
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: "technology" })
  public sdk: SDK;
}

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "project id" })
  public id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "project name" })
  public name?: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({ description: "project logo url" })
  // public logo?: string;

  // @IsString()
  // @IsOptional()
  // @MaxLength(256)
  // @ApiProperty({ description: "project about description" })
  // public aboutDescription?: string;
}
