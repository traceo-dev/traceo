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

export class MetricPanelDatasourceQueryDto {
  @IsNotEmpty()
  from: number;

  @IsNotEmpty()
  to: number;

  @IsNotEmpty()
  @IsString()
  tz: string;
}

export class ExploreMetricsQueryDto extends MetricQueryDto {
  @IsOptional()
  valueMax?: number;

  @IsOptional()
  valueMin?: number;

  @IsOptional()
  interval = 1;

  isHistogram = false;
}

export class MetricsQueryDto {
  @IsOptional()
  @IsString()
  search: string;
}

class UpdateHistogramBucketDto {
  @IsNotEmpty()
  size = 5;

  @IsNotEmpty()
  offset = 0;
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
  show = false;

  @IsString()
  @IsOptional()
  position: TOOLTIP_POSITION = "right";
}

class UpdateLegendMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show = false;

  @IsString()
  @IsNotEmpty()
  orient = "vertical";
}

class UpdateStackMetricDto {
  @IsBoolean()
  @IsOptional()
  show = false;

  @IsString()
  @IsOptional()
  strategy: string = null;
}

class UpdateAreaMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show = false;

  // @IsInt()
  @IsNotEmpty()
  opacity = 50;
}

class UpdateMarkerMetricDto {
  @IsBoolean()
  @IsNotEmpty()
  show = false;

  @IsString()
  @IsOptional()
  shape = "rect";
}
class UpdateLineMetricDto {
  @IsInt()
  @IsNotEmpty()
  width = 1;

  @ValidateNested()
  @Type(() => UpdateMarkerMetricDto)
  marker: UpdateMarkerMetricDto;
}

class UpdateMetricTextDto {
  @IsInt()
  @IsOptional()
  size = 24;

  @IsInt()
  @IsOptional()
  weight = 500;

  @IsString()
  @IsOptional()
  color = "rect";

  @IsString()
  @IsOptional()
  value: string;
}

class UpdateMetricAxisDto {
  @IsBoolean()
  @IsNotEmpty()
  showX = true;

  @IsBoolean()
  @IsNotEmpty()
  showY = true;

  @IsBoolean()
  @IsNotEmpty()
  showGridLines = true;

  @IsBoolean()
  @IsNotEmpty()
  showFloatLabels = true;
}

export class UpdateOptionsMetricDto {
  @IsEnum(METRIC_UNIT)
  @IsOptional()
  @ApiPropertyOptional()
  unit: METRIC_UNIT = METRIC_UNIT.NONE;

  @ValidateNested()
  // @IsNotEmpty()
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

  @ValidateNested()
  @Type(() => UpdateMetricTextDto)
  text: UpdateMetricTextDto;
}

class UpdateSerieDatasourceDto {
  @IsString()
  @IsOptional()
  field: PLOT_TYPE;

  @IsString()
  @IsOptional()
  query: PLOT_TYPE;

  @IsString()
  @IsOptional()
  formula: PLOT_TYPE;
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
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  show = true;

  @IsEnum(METRIC_UNIT)
  @IsOptional()
  @ApiPropertyOptional()
  unit: METRIC_UNIT = METRIC_UNIT.NONE;

  @ValidateNested()
  @Type(() => UpdateSerieDatasourceDto)
  datasource: UpdateSerieDatasourceDto;

  @ValidateNested()
  @Type(() => UpdateSerieMetricConfigDto)
  config: UpdateSerieMetricConfigDto;
}
