import { MemberRole } from "../enums/amr.enum";
import { IAccount } from "./account.interface";
import { IApplication } from "./application.interface";

export interface IAmr {
    id?: string;
    role: MemberRole;
    account: IAccount;
    application: IApplication;
}