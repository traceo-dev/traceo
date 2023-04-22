import { ApiPropertyOptional } from "@nestjs/swagger";
import { AlertEnumType, AlertSeverity, AlertStatus, LogicOperator } from "@traceo/types";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber, ValidateNested } from "class-validator";
import { BaseDtoQuery } from "src/common/base/query/base-query.model";

export class AlertQueryDto extends BaseDtoQuery {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    status: AlertStatus;
}

export class AlertHistoryQueryDto extends BaseDtoQuery {
    @IsString()
    @IsNotEmpty()
    alertId: string;
}

export class CreateAlertDto {
    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsString()
    @IsNotEmpty()
    type: AlertEnumType;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;

    @IsNotEmpty()
    minTimeInterval: number;

    @IsString()
    @IsNotEmpty()
    severity: AlertSeverity;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    logicOperator: LogicOperator;

    @IsBoolean()
    @IsNotEmpty()
    inAppNotification: boolean;

    @IsBoolean()
    @IsNotEmpty()
    emailNotification: boolean;

    @ValidateNested()
    @Type(() => AlertRuleDto)
    rules: AlertRuleDto[];

    // list of ids
    @IsArray()
    @IsOptional()
    @ApiPropertyOptional()
    recipients: string[];
}

class AlertRuleDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    field: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    operator: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    value: string;

    @IsOptional()
    @ApiPropertyOptional()
    count: number;

    @IsOptional()
    @ApiPropertyOptional()
    time: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    incidentId: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    metricId: string;
}