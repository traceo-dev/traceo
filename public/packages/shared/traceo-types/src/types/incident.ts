import { IProject } from "./project";
import { BrowserInfoType } from "./browser";
import { SDK } from "./sdk";
import { IUser } from "./user";
import { Dictionary } from ".";

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress"
}

export enum IncidentStatusSearch {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress",
  ALL = "all"
}

export interface IIncident {
  id?: string;

  sdk: SDK;
  status: IncidentStatus;
  stack: string;
  // eq. BadRequestException
  name: string;
  // eq.
  message: string;

  // time when last error occur for this incident
  lastEventAt: number;
  createdAt?: number;

  project: IProject;
  assigned: Pick<IUser, "id" | "name" | "gravatar">;
  // information about incident platform only for backend SDKs
  // for browsers this infomation is persisted inside IError structure
  platform?: Dictionary<string | number>;

  traces: Array<Trace>;

  eventsCount: number;
}

/**
 * Payload received from SDK
 */

export interface IncidentEventPayload {
  sdk: SDK;
  name: string;
  message: string;

  stack: string;
  stackFrames?: StackFrame[];

  details?: string;
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
  LAST_SEEN = "lastEventAt",
  FIRST_SEEN = "createdAt",
  STATUS = "status"
  // ERRORS_COUNT = "eventsCount"
}

export const mapIncidentSort: Record<IncidentSortBy, string> = {
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.STATUS]: "Status"
  // [IncidentSortBy.ERRORS_COUNT]: "Events count"
};
