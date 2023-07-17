import { IProject } from "./project";
import { IUser } from "./user";

export enum MemberRole {
  ADMINISTRATOR = "Administrator",
  MAINTAINER = "Maintainer",
  VIEWER = "Viewer",
  NONE = "None"
}

export interface IMember {
  id?: string;
  role: MemberRole;
  user: IUser;
  project: IProject;
}
