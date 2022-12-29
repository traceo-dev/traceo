import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { METRIC_UNIT, TOOLTIP_POSITION } from "../interfaces/metrics.interface";

export class MetricQueryDto {
    @IsArray()
    @IsNotEmpty()
    fields: string[];

    // @IsInt()
    @IsNotEmpty()
    hrCount: number;
}

export class UpdateTooltipMetricDto {
    @IsBoolean()
    @IsNotEmpty()
    show: boolean = false;

    @IsString()
    @IsNotEmpty()
    position: TOOLTIP_POSITION = "right";
}

export class UpdateLegendMetricDto {
    @IsBoolean()
    @IsNotEmpty()
    show: boolean = false;

    @IsString()
    @IsNotEmpty()
    orient: string = "vertical";
}

export class UpdateConfigMetricDto {
    @IsBoolean()
    @IsNotEmpty()
    showDescription: boolean = true;

    @ValidateNested()
    @Type(() => UpdateTooltipMetricDto)
    tooltip: UpdateTooltipMetricDto;

    @ValidateNested()
    @Type(() => UpdateLegendMetricDto)
    legend: UpdateLegendMetricDto;
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

    @IsEnum(METRIC_UNIT)
    @IsNotEmpty()
    unit: METRIC_UNIT = METRIC_UNIT.NONE;

    @ValidateNested()
    @Type(() => UpdateConfigMetricDto)
    config: UpdateConfigMetricDto;
}
