import { Application } from "./application";
import { Comment } from "./comments";

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

export const mapIncidentStatus: Record<IncidentStatusSearch, string> =
{
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

export interface Incident {
  id: string;
  appId: string;
  status: IncidentStatus;
  type: string;
  message: string;
  createdAt: number;
  stack: string;
  traces?: Trace[];
  errorsCount?: number;
  lastError?: number;
  errorsDetails?: ErrorDetails[];
  platform: {
    arch: string;
    platform: string;
    release: string;
    version: string;
  };
  assigned: {
    id: string;
    name: string;
    gravatar: string;
  };
  comments: Comment[];
  commentsCount?: number;
  application?: Application;
}

export interface ErrorDetails {
  date: number;
  type?: string;
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
