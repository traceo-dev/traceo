import { PANEL_TYPE } from "@traceo/types";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateOptionsMetricDto } from "./metrics.dto";
import { Type } from "class-transformer";

export class DashboardQueryDto { }

export class DashboardDto {
    @IsOptional()
    @IsString()
    dashboardId?: string;

    @IsNotEmpty()
    @IsString()
    projectId?: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class DashboardPanelDto {
    @IsOptional()
    @IsString()
    panelId?: string;

    @IsNotEmpty()
    @IsString()
    dashboardId: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    type: PANEL_TYPE = PANEL_TYPE.TIME_SERIES;

    @ValidateNested()
    @Type(() => GridPositionDto)
    gridPosition: GridPositionDto;

    @ValidateNested()
    @Type(() => UpdateOptionsMetricDto)
    config: UpdateOptionsMetricDto;
}

class GridPositionDto {
    @IsNotEmpty()
    x: number;

    @IsNotEmpty()
    y: number;

    @IsNotEmpty()
    w: number;

    @IsNotEmpty()
    h: number;
}
