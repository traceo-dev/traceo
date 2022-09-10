import { Account } from "./accounts";
import { SortOrder } from "./api";

export enum MemberRole {
  ADMINISTRATOR = "Administrator",
  MAINTAINER = "Maintainer",
  VIEWER = "Viewer"
}

export enum ENVIRONMENT {
  production = "production",
  development = "development",
  test = "test"
}
export interface OwnerAccount {
  name: string;
  logo: string;
}

export interface Application {
  id?: string;
  name: string;
  dsn?: string;
  owner: OwnerAccount;
  logo?: string;
  lastIncidentAt?: number;
  incidentsCount: number;
  defaultEnv?: ENVIRONMENT;
  createdAt: number;
  updatedAt: number;
  member: {
    role: MemberRole;
  };
}

export interface AddAccountToApplication {
  role: MemberRole;
  applicationId: number;
  accountId: string;
}

export interface ApplicationMember {
  id: string;
  status: MemberRole;
  account: Account;
  lastUpdate: number;
}

export interface ApplicationMemberUpdateProps {
  id: string;
  status: MemberRole;
}

export interface ApplicationMember {
  id: string;
  role: MemberRole;
  favorite: boolean;
  application: Application;
}

export interface CreateApplicationProps {
  name: string;
  framework: string;
  technology: string;
}

export interface UpdateAccountApplicationProps {
  id?: string;
  favorite?: boolean;
}

export interface UpdateApplicationProps {
  name?: string;
  logo?: string;
  defaultEnv?: ENVIRONMENT;
}

export interface SearchApplicationQueryParams {
  order?: SortOrder;
  sortBy?: string;
  search?: string;
  favorite?: boolean;
  accountId?: string;
}
