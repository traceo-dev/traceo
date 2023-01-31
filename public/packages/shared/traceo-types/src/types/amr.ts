import { IAccount } from "./account";
import { IApplication } from "./application";

export enum MemberRole {
    ADMINISTRATOR = "Administrator",
    MAINTAINER = "Maintainer",
    VIEWER = "Viewer",
}

export interface IAmr {
    id?: string;
    role: MemberRole;
    account: IAccount;
    application: IApplication;
}