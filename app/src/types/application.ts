import { Account } from "./accounts";
import { SortOrder } from "./api";

export enum MEMBER_STATUS {
  OWNER = "Owner",
  ADMINISTRATOR = "Administrator",
  DEVELOPER = "Developer"
}

export enum ENVIRONMENT {
  production = "production",
  development = "development",
  test = "test"
}

export enum TECHNOLOGY {
  NODEJS = "nodejs",
  JAVASCRIPT = "js",
  TYPESCRIPT = "ts"
}

export enum FRAMEWORK {
  EXPRESS = "express",
  NESTJS = "nestjs",
  ELECTRON = "electron"
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
  technology: TECHNOLOGY;
  framework: FRAMEWORK;
  logo?: string;
  lastIncidentAt?: number;
  incidentsCount: number;
  defaultEnv?: ENVIRONMENT;
  createdAt: number;
  updatedAt: number;
  member: {
    status: MEMBER_STATUS;
  };
}

export interface ApplicationMember {
  id: string;
  status: MEMBER_STATUS;
  account: Account;
  lastUpdate: number;
}

export interface ApplicationMemberUpdateProps {
  id: string;
  status: MEMBER_STATUS;
}

export interface AccountApplication {
  id: string;
  status: MEMBER_STATUS;
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
}
