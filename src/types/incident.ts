import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { BaseDtoQuery, Environment } from "src/core/generic.model";

export interface KlepperIncidentModel {
  type: string;
  message: string;
  date: number;
  stack: string;
  stackFrames?: StackFrame[];
  appId: string;
  requestData?: KlepperRequest;
  catchType?: CatchType;
  options?: {
    priority?: ExceptionPriority;
    tag?: string;
  };
  persist?: boolean;
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

export interface StackFrame {
  filename?: string;
  function?: string;
  lineNo?: number;
  columnNo?: number;
  internal?: boolean;
  absPath?: string;
  extension?: string;
}

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
}

export interface Incident {
  status: IncidentStatus;
  type: string;
  message: string;
  date: number;
  stack: string;
  traces?: Trace[];
  appId: string;
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
  occurDates?: ErrorDetails[];

  assigned: {
    id: string;
    name: string;
    logo: string;
  };

  comments: Comment[];
  commentsCount?: number;
}

export interface ErrorDetails {
  date: number;
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

export enum IncidentStatusSearch {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  ARCHIVED = "archived",
  MUTED = "muted",
  ALL = "all",
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

export type VersionSetter = "klepper" | "sdk";

export interface Deployment {
  deployedAt: number;
  os: Platform;
}

export interface Platform {
  arch: string;
  platform: string;
  release: string;
  version: string;
}
