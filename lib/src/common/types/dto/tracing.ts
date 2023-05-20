import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { BaseDtoQuery } from "../../../common/base/query/base-query.model";
import { Type } from "class-transformer";

export class QueryTracingDto extends BaseDtoQuery {
    @IsString()
    @IsOptional()
    readonly serviceName?: string;

    @IsString()
    @IsOptional()
    readonly spanName?: string;

    @IsString()
    @IsOptional()
    readonly traceStatus?: string;

    @IsString()
    @IsOptional()
    readonly traceKind?: string;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    readonly durationMin?: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    readonly durationMax?: number;

    // @IsInt()
    @IsNotEmpty()
    readonly from: number;

    // @IsInt()
    @IsNotEmpty()
    readonly to: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    readonly take?: number = 100;
}
