import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { BaseDtoQuery } from "../../base/query/base-query.model";
import { IncidentStatus, IncidentStatusSearch } from "../enums/incident.enum";

export class IncidentQueryDto extends BaseDtoQuery {
    @ApiPropertyOptional()
    @Type(() => String)
    @IsOptional()
    readonly status?: IncidentStatusSearch;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsOptional()
    readonly size?: number;
}

export class Resolved {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly id: string;
}

export class IncidentUpdateDto {
    @ApiPropertyOptional()
    @IsEnum(IncidentStatus)
    @IsOptional()
    readonly status?: IncidentStatus;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly assignedId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly assigned: any;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Resolved)
    readonly resolved: Resolved;
}

export class IncidentBatchUpdateDto extends IncidentUpdateDto {
    @IsOptional()
    incidentsIds: string[];
}