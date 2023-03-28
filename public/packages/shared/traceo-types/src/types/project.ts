import { Dictionary } from ".";
import { SortOrder } from "./api";
import { MemberRole } from "./member";
import { SDK } from "./sdk";
import { IUser } from "./user";

export interface IProject {
  id?: string;
  name: string;
  sdk: SDK;

  owner: Owner;
  gravatar?: string;

  lastEventAt?: number;
  createdAt?: number;
  updatedAt?: number;

  incidentsCount: number;
  // membersCount: number;

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

export interface IProjectResponse extends Omit<IProject, "influxDS" | "owner"> {
  member: {
    role: MemberRole;
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
} & IProject;

export type CreateApplicationProps = {
  name: string;
  sdk: SDK;
};

export type UpdateApplicationProps = Pick<IProject, "name">;

export interface SearchApplicationQueryParams {
  order?: SortOrder;
  sortBy?: string;
  search?: string;
  userId?: string;
}
