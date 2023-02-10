import { IAmr } from "./amr";

export type AddUserProps = Pick<IUser, "email" | "name" | "username"> & { password: string; }

export enum UserRole {
    ADMIN = "admin",
    GUEST = "guest",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISABLED = "disabled",
}

export interface IUser {
    id?: string;
    name: string;
    username: string;
    email: string;
    gravatar: string;
    password: string;
    status: UserStatus;
    isAdmin: boolean;
    applications: IAmr[];
    isPasswordUpdated: boolean;
    lastActiveAt?: number;
    // active: boolean;
    createdAt?: number;
    // about: string;
}
