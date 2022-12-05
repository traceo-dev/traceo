import { Account } from "./accounts";
import { SortOrder } from "./api";
import { InfluxDS } from "./tsdb";

export enum MemberRole {
  ADMINISTRATOR = "Administrator",
  MAINTAINER = "Maintainer",
  VIEWER = "Viewer"
}

export interface OwnerAccount {
  name: string;
  email: string;
  username: string;
}

export enum TSDB {
  INFLUX = "influx",
  INFLUX2 = "influx2",
  PROMETHEUS = "prometheus"
}

export interface Application {
  id?: string;
  name: string;
  dsn?: string;
  owner: OwnerAccount;
  gravatar?: string;
  lastIncidentAt?: number;
  incidentsCount: number;
  errorsCount: number;
  membersCount: number;
  createdAt: number;
  updatedAt: number;
  member: {
    role: MemberRole;
  };
  connectedTSDB?: TSDB;
  influxDS: InfluxDS;
  isIntegrated: boolean;
  runtimeConfig: {
    data: { [key: string]: any }
  }
  security: {
    apiKey: string;
    lastUpdate: number;
    generatedBy: string;
  }
}

export interface AddAccountToApplication {
  role: MemberRole;
  applicationId: string;
  accountId: string;
}

export interface ApplicationMemberUpdateProps {
  memberId: string;
  role: MemberRole;
}

export interface ApplicationMember {
  id: string;
  role: MemberRole;
  application: Application;
  account: Account;
}

export type CreateApplicationProps = Pick<Application, "name">;
export type UpdateApplicationProps = Pick<Application, "name">;

export interface SearchApplicationQueryParams {
  order?: SortOrder;
  sortBy?: string;
  search?: string;
  accountId?: string;
}
