import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { METRIC_UNIT, TOOLTIP_POSITION } from "@shared/interfaces/metrics.interface";

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

export class UpdateAreaMetricDto {
    @IsBoolean()
    @IsNotEmpty()
    show: boolean = false;

    // @IsInt()
    @IsNotEmpty()
    opacity: number = 50;
}

export class UpdateMarkerMetricDto {
    @IsBoolean()
    @IsNotEmpty()
    show: boolean = false;
}
export class UpdateLineMetricDto {
    @IsInt()
    @IsNotEmpty()
    width: number = 1;

    @ValidateNested()
    @Type(() => UpdateMarkerMetricDto)
    marker: UpdateMarkerMetricDto;
}

export class UpdateConfigMetricDto {
    @ValidateNested()
    @Type(() => UpdateTooltipMetricDto)
    tooltip: UpdateTooltipMetricDto;

    @ValidateNested()
    @Type(() => UpdateLegendMetricDto)
    legend: UpdateLegendMetricDto;

    @ValidateNested()
    @Type(() => UpdateAreaMetricDto)
    area: UpdateAreaMetricDto;

    @ValidateNested()
    @Type(() => UpdateLineMetricDto)
    line: UpdateLineMetricDto;
}

export class UpdateMetricDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    showDescription: boolean = true;

    // @IsBoolean()
    // @IsNotEmpty()
    // show: boolean;

    @IsEnum(METRIC_UNIT)
    @IsOptional()
    unit: METRIC_UNIT = METRIC_UNIT.NONE;

    @ValidateNested()
    @Type(() => UpdateConfigMetricDto)
    config: UpdateConfigMetricDto;
}
