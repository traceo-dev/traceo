import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { METRIC_UNIT, PLOT_TYPE, TOOLTIP_POSITION } from "@traceo/types";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class MetricQueryDto {
  @IsArray()
  @IsNotEmpty()
  fields: string[];

  @IsNotEmpty()
  from: number;

  @IsNotEmpty()
  to: number;
}

export class MetricsQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}

class UpdateTooltipMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show: boolean = false;

  @IsString()
  @IsNotEmpty()
  position: TOOLTIP_POSITION = "right";
}

class UpdateLegendMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show: boolean = false;

  @IsString()
  @IsNotEmpty()
  orient: string = "vertical";
}

class UpdateAreaMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show: boolean = false;

  // @IsInt()
  @IsNotEmpty()
  opacity: number = 50;
}

class UpdateMarkerMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show: boolean = false;
}
class UpdateLineMetricDto {
  @IsInt()
  @IsNotEmpty()
  width: number = 1;

  @ValidateNested()
  @Type(() => UpdateMarkerMetricDto)
  marker: UpdateMarkerMetricDto;
}

class UpdateMetricAxisDto {
  @IsBoolean()
  @IsNotEmpty()
  showX: boolean = true;

  @IsBoolean()
  @IsNotEmpty()
  showY: boolean = true;

  @IsBoolean()
  @IsNotEmpty()
  showGridLines: boolean = true;
}

class UpdateConfigMetricDto {
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

  @ValidateNested()
  @Type(() => UpdateMetricAxisDto)
  axis: UpdateMetricAxisDto;
}

class UpdateSerieMetricConfigDto {
  @IsString()
  @IsNotEmpty()
  type: PLOT_TYPE;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  lineWidth?: number;

  @IsNotEmpty()
  barWidth?: number;

  @ValidateNested()
  @Type(() => UpdateAreaMetricDto)
  area: UpdateAreaMetricDto;
}

export class UpdateSerieMetricDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  show: boolean = true;

  @IsEnum(METRIC_UNIT)
  @IsOptional()
  @ApiPropertyOptional()
  unit: METRIC_UNIT = METRIC_UNIT.NONE;

  @IsString()
  @IsNotEmpty()
  field: string;

  @IsString()
  @IsOptional()
  type: string;

  @ValidateNested()
  @Type(() => UpdateSerieMetricConfigDto)
  config: UpdateSerieMetricConfigDto;
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

  @ValidateNested()
  @Type(() => UpdateSerieMetricDto)
  series: UpdateSerieMetricDto[];

  @IsEnum(METRIC_UNIT)
  @IsOptional()
  @ApiPropertyOptional()
  unit: METRIC_UNIT = METRIC_UNIT.NONE;

  @ValidateNested()
  @Type(() => UpdateConfigMetricDto)
  config: UpdateConfigMetricDto;
}
