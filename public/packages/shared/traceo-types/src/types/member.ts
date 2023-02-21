import { IApplication } from "./application";
import { IUser } from "./user";

export enum MemberRole {
  ADMINISTRATOR = "Administrator",
  MAINTAINER = "Maintainer",
  VIEWER = "Viewer"
}

export interface IMember {
  id?: string;
  role: MemberRole;
  user: IUser;
  application: IApplication;
}
