import { IAmr } from "./amr";

export type AddAccountProps = Pick<IAccount, "email" | "name" | "username"> & { password: string; }

export enum AccountRole {
    ADMIN = "admin",
    GUEST = "guest",
}

export enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISABLED = "disabled",
}

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
    isPasswordUpdated: boolean;
    lastActiveAt?: number;
    // active: boolean;
    createdAt?: number;
    // about: string;
}
