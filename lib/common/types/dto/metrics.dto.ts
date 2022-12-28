import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MetricQueryDto {
    @IsArray()
    @IsNotEmpty()
    fields: string[];

    // @IsInt()
    @IsNotEmpty()
    hrCount: number;
}

export class UpdateMetricDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    // @IsBoolean()
    // @IsNotEmpty()
    // show: boolean;

    // @IsString()
    // @IsNotEmpty()
    // unit: string;
}