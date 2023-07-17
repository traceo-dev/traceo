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
  isIntegrated: boolean;

  apiKey: string;

  mainDashboardId: string;
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

// export interface AddUserToApplication {
//   role: {
//     value: MemberRole;
//   };
//   project: {
//     value: string;
//   };
//   userId: string;
// }

// export interface ApplicationMemberUpdateProps {
//   memberId: string;
//   role: MemberRole;
// }

export type ProjectMember = {
  id: string;
  userId: string;
  role: MemberRole;
} & IUser;

export type MemberProject = {
  id: string;
  projectId: string;
  role: MemberRole;
} & IProject;

export type CreateProjectProps = {
  name: string;
  sdk: SDK;
};

export type UpdateProjectProps = Pick<IProject, "name">;

export interface SearchProjectQueryParams {
  order?: SortOrder;
  sortBy?: string;
  search?: string;
  userId?: string;
}
