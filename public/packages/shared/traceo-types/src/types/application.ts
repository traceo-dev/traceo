import { Dictionary } from ".";
import { SortOrder } from "./api";
import { DatasourceProvider } from "./datasource";
import { MemberRole } from "./member";
import { SDK } from "./sdk";
import { ConnectionStatus } from "./tsdb";
import { IUser } from "./user";

export interface IApplication {
  id?: string;
  name: string;
  sdk: SDK;

  owner: Owner;
  gravatar?: string;
  
  lastEventAt?: number;
  createdAt?: number;
  updatedAt?: number;

  incidentsCount: number;
  membersCount: number;

  tsdbDatasource?: string;
  isIntegrated: boolean;

// field only for server-side SDKs
// overrided after every application startup
  runtimeConfig?: Dictionary<string | number | undefined | null>;

  security?: ISecurity;
}

export interface ISecurity {
  apiKey: string;
  lastUpdate: number;
  generatedBy: string;
}

export interface IApplicationResponse extends Omit<IApplication, "influxDS" | "owner"> {
  member: {
    role: MemberRole;
  };
  influxDS?: {
    connStatus: ConnectionStatus;
    connError?: string;
  };
  owner?: {
    name: string;
  };
}

export interface Owner {
  name: string;
  email: string;
  username: string;
}

export interface AddUserToApplication {
  role: {
    value: MemberRole;
  };
  application: {
    value: string;
  };
  userId: string;
}

export interface ApplicationMemberUpdateProps {
  memberId: string;
  role: MemberRole;
}

export type ApplicationMember = {
  id: string;
  userId: string;
  role: MemberRole;
} & IUser;

export type MemberApplication = {
  id: string;
  appId: string;
  role: MemberRole;
} & IApplication;

export type CreateApplicationProps = {
  name: string;
  sdk: SDK;
  tsdbProvider: DatasourceProvider;
  url: string;
  tsdbConfiguration: { [key: string]: any };
};

export type UpdateApplicationProps = Pick<IApplication, "name">;

export interface SearchApplicationQueryParams {
  order?: SortOrder;
  sortBy?: string;
  search?: string;
  userId?: string;
}
