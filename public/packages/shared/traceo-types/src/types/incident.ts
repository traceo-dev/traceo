import { IApplication } from "./application";
import { BrowserInfoType } from "./browser";
import { IComment } from "./comment";
import { SDK } from "./sdk";
import { IUser } from "./user";

export type SDKIncidentPayload = IncomingBrowserIncidentType | IncomingNodeIncidentType;

export type RequestMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export enum CatchType {
  /**
   * Exception handled by middleware, eq. Middleware.errorMiddleware()
   */
  MIDDLEWARE = "middleware",

  /**
   * Exception handled by function catchException() in interceptors or try/catch clause
   */
  INTERNAL = "internal"
}

export enum ExceptionPriority {
  MINOR = "minor",
  IMPORTANT = "important",
  CRITICAL = "critical"
}

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress"
}

export enum IncidentStatusSearch {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress",
  // ARCHIVED = "archived", //TODO: to implement
  // MUTED = "muted", //TODO: to implement
  ALL = "all"
}

export interface IIncident {
  id?: string;
  sdk: SDK;
  status: IncidentStatus;
  stack: string;
  type: string;
  message: string;
  lastError: number;
  errorsCount: number;
  application: IApplication;
  assigned: Pick<IUser, "id" | "name" | "gravatar">;
  comments: IComment[];
  commentsCount: number;
  platform: Platform;
  errorsDetails: Array<ErrorDetails>;
  traces: Array<Trace>;
  createdAt?: number;
}

/**
 * Payload received from SDK
 */

export interface BaseIncidentType {
  type: string;
  message: string;
  stack: string;
  sdk: SDK;
}

export interface IncomingNodeIncidentType extends BaseIncidentType {
  stackFrames?: StackFrame[];
}

export interface IncomingBrowserIncidentType extends BaseIncidentType {
  browser: BrowserInfoType
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

export interface Platform {
  arch: string;
  platform: string;
  release: string;
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

export interface ErrorDetails {
  date: number;
  type?: string;
  browser?: Pick<BrowserInfoType, "browser" | "os" | "url">;
}

export const mapIncidentStatus: Record<IncidentStatusSearch, string> = {
  [IncidentStatusSearch.RESOLVED]: "Resolved",
  [IncidentStatusSearch.UNRESOLVED]: "Unresolved",
  [IncidentStatusSearch.IN_PROGRESS]: "In Progress",
  [IncidentStatusSearch.ALL]: "All"
};

export enum IncidentSortBy {
  LAST_SEEN = "last_error",
  FIRST_SEEN = "created_at",
  STATUS = "status",
  ERRORS_COUNT = "errors_count"
}

export const mapIncidentSort: Record<IncidentSortBy, string> = {
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.STATUS]: "Status",
  [IncidentSortBy.ERRORS_COUNT]: "Errors count"
};
