import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer/types/decorators";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { Environment } from "lib/core/generic.model";

export class CreateApplicationBody {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "name" })
  public name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: "aboutDescription" })
  public aboutDescription: string;
}

export class ApplicationBody {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "app id" })
  public id?: number;

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

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "app default env" })
  public defaultEnv?: Environment;
}

export interface ApplicationLogsQuery {
  readonly id: number;
  readonly env: Environment;
  readonly startDate: number;
  readonly endDate: number;
}