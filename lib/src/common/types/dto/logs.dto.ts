import { LogLevel } from "@traceo/types";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, Max } from "class-validator";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";

export class LogsQuery extends BaseDtoQuery {
  @IsNotEmpty()
  readonly from: number;

  @IsNotEmpty()
  readonly to: number;

  @IsArray()
  readonly levels: LogLevel[];

  @Type(() => Number)
  @IsInt()
  @Max(2000)
  @IsOptional()
  readonly take?: number = 250;
}
