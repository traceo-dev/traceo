import { IUser } from "./user";
import { IApplication } from "./application";

export enum MemberRole {
    ADMINISTRATOR = "Administrator",
    MAINTAINER = "Maintainer",
    VIEWER = "Viewer",
}

export interface IMember {
    id?: string;
    role: MemberRole;
    user: IUser;
    application: IApplication;
}