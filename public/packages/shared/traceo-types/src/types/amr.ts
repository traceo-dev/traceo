import { IUser } from "./account";
import { IApplication } from "./application";

export enum MemberRole {
    ADMINISTRATOR = "Administrator",
    MAINTAINER = "Maintainer",
    VIEWER = "Viewer",
}

export interface IAmr {
    id?: string;
    role: MemberRole;
    account: IUser;
    application: IApplication;
}