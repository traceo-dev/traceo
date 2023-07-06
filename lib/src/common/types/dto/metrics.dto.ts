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
import { METRIC_UNIT, PLOT_TYPE, TOOLTIP_POSITION, VISUALIZATION_TYPE } from "@traceo/types";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class MetricQueryDto {
  @IsArray()
  @IsOptional()
  fields: string[] = [];

  @IsNotEmpty()
  from: number;

  @IsNotEmpty()
  to: number;

  @IsOptional()
  @IsString()
  panelId?: string;
}

export class ExploreMetricsQueryDto extends MetricQueryDto {
  @IsOptional()
  valueMax?: number;

  @IsOptional()
  valueMin?: number;

  @IsOptional()
  interval: number = 1;

  isHistogram: boolean = false;
}

export class MetricsQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}

class UpdateHistogramBucketDto {
  @IsNotEmpty()
  size: number = 5;

  @IsNotEmpty()
  offset: number = 0;
}

class UpdateHistogramDto {
  @ValidateNested()
  @Type(() => UpdateHistogramBucketDto)
  bucket: UpdateHistogramBucketDto;

  @IsOptional()
  min: number = undefined;

  @IsOptional()
  max: number = undefined;
}

class UpdateTooltipMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show: boolean = false;

  @IsString()
  @IsOptional()
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

class UpdateStackMetricDto {
  @IsBoolean()
  @IsOptional()
  show: boolean = false;

  @IsString()
  @IsOptional()
  strategy: string = null;
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

  @IsString()
  @IsOptional()
  shape: string = "rect";
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

export class UpdateOptionsMetricDto {
  @IsEnum(METRIC_UNIT)
  @IsOptional()
  @ApiPropertyOptional()
  unit: METRIC_UNIT = METRIC_UNIT.NONE;

  @ValidateNested()
  @IsNotEmpty()
  @IsArray({
    always: true
  })
  @Type(() => UpdateSerieMetricDto)
  series: UpdateSerieMetricDto[];

  @ValidateNested()
  @Type(() => UpdateHistogramDto)
  histogram: UpdateHistogramDto;

  @ValidateNested()
  @Type(() => UpdateTooltipMetricDto)
  tooltip: UpdateTooltipMetricDto;

  @ValidateNested()
  @Type(() => UpdateStackMetricDto)
  stack: UpdateStackMetricDto;

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

  @IsString()
  @IsNotEmpty()
  visualization: VISUALIZATION_TYPE = VISUALIZATION_TYPE.TIME_SERIES;
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

class UpdateSerieMetricDto {
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

  // @IsString()
  // @IsOptional()
  // type: string;

  @ValidateNested()
  @Type(() => UpdateSerieMetricConfigDto)
  config: UpdateSerieMetricConfigDto;
}

