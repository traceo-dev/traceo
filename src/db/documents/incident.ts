import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { PageOptionsDto } from "src/core/core.model";
import { Environment, Platform } from "./release";
import { Comment } from "./comments";

export enum IncidentStatus {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved",
    ARCHIVED = "archived",
    MUTED = "muted"
}


export interface Incident {
    status: IncidentStatus;
    type: string;
    message: string;
    date: number;
    stack: string;
    traces?: Trace[];
    projectId?: string;
    requestData?: KlepperRequest;
    catchType?: CatchType;
    options?: {
        priority?: ExceptionPriority;
        tag?: string;
    };

    env?: Environment;
    version?: string;
    platform: Platform;

    occuredCount?: number;
    lastOccur?: number;
    occurDates?: OccurrDate[];

    assigned: {
        id: string;
        name: string;
        logo: string;
    }

    comments: Comment[];
    commentsCount?: number;
}

export interface OccurrDate {
    date: number;
}

export class KlepperRequest {
    payload?: Object;
    headers?: Object;
    query?: Object;
    url?: Object;
    method?: RequestMethodType;
    ip?: string | string[] | undefined;
}

export type RequestMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export enum CatchType {
    /**
     * Exception handled by middleware, eq. Middleware.errorMiddleware()
     */
    MIDDLEWARE = "middleware",

    /**
     * Exception handled by function catchException() in interceptors or try/catch clause
     */
    INTERNAL = "internal",
}

export enum ExceptionPriority {
    MINOR = "minor",
    IMPORTANT = "important",
    CRITICAL = "critical",
}

export interface Trace {
    filename?: string;
    function?: string;
    lineNo?: number;
    columnNo?: number;
    internal?: boolean;
    absPath?: string;
    extension?: string;
    code: string;
    preCode: string[];
    postCode: string[];
}


export class IncidentSearchDto extends PageOptionsDto {
    @ApiPropertyOptional()
    @Type(() => String)
    @IsOptional()
    readonly status?: IncidentStatusSearch;
}

export enum IncidentStatusSearch {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved",
    ARCHIVED = "archived",
    MUTED = "muted",
    ALL = "all"
}

export class Assigned {
    @Type(() => String)
    @IsString()
    readonly id?: string;

    @Type(() => String)
    @IsString()
    readonly name?: string;

    @ApiPropertyOptional()
    @Type(() => String)
    @IsOptional()
    readonly logo?: string;
}

export class IncidentUpdateDto {
    @ApiPropertyOptional()
    @IsEnum(IncidentStatus)
    @IsOptional()
    readonly status?: IncidentStatus;

    @ApiPropertyOptional()
    @ValidateNested({ each: true })
    @Type(() => Assigned)
    @IsOptional()
    readonly assigned?: Assigned;  
}

export class IncidentBatchUpdateDto extends IncidentUpdateDto {
    @IsOptional()
    incidentsIds: string[];
}
