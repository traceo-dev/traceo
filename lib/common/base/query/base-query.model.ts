import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export class BaseDtoQuery {
  @IsString()
  @IsOptional()
  readonly appId?: string;

  @IsString()
  @IsOptional()
  readonly incidentId?: string;

  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 50;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  readonly sortBy?: string;
}
