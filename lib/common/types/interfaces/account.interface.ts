import { Incident } from "../../../db/entities/incident.entity";
import { AccountStatus } from "../enums/account.enum";
import { IAmr } from "./amr.interface";

export interface IAccount {
    id?: string;
    name: string;
    username: string;
    email: string;
    gravatar: string;
    password: string;
    status: AccountStatus;
    isAdmin: boolean;
    applications: IAmr[];
    incidents: Incident[];
    isPasswordUpdated: boolean;
    lastActiveAt?: number;
}

export interface RequestUser {
    id: string;
    email: string;
    name: string;
}
