import { ENVIRONMENT, Application } from "./application";
import { Comment } from "./comments";

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved"
}

export enum IncidentStatusSearch {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  ALL = "all"
}

export const handleIncidentStatus: Record<IncidentStatus | IncidentStatusSearch, string> =
  {
    [IncidentStatus.RESOLVED]: "Resolved",
    [IncidentStatus.UNRESOLVED]: "Unresolved",
    [IncidentStatusSearch.ALL]: "All"
  };

export enum IncidentSortBy {
  LAST_SEEN = "lastOccur",
  FIRST_SEEN = "createdAt",
  STATUS = "status",
  OCCUR_COUNT = "occuredCount"
}

export const handleIncidentSort: Record<IncidentSortBy, string> = {
  [IncidentSortBy.LAST_SEEN]: "Last seen",
  [IncidentSortBy.FIRST_SEEN]: "First seen",
  [IncidentSortBy.STATUS]: "Status",
  [IncidentSortBy.OCCUR_COUNT]: "Occur count"
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
  env: ENVIRONMENT;
  occuredCount?: number;
  lastOccur?: number;
  occurDates?: ErrorDetails[];
  platform: {
    arch: string;
    platform: string;
    release: string;
    version: string;
  };
  assigned: {
    id: string;
    name: string;
    logo: string;
  };
  comments: Comment[];
  commentsCount?: number;
  application?: Application;
}

export interface ErrorDetails {
  date: number;
  version?: {
    id: string;
    name: string;
  };
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
