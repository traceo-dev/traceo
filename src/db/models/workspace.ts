import { Account } from "../entities/account.entity";

export interface WorkspaceResponse {
    _id: string;
    name: string;
    privateKey: string;
    owner: {
        name: string;
        logo: string;
    } | Account;
    aboutDescription?: string;
    logo?: string;
    createdAt: number;
    updatedAt: number;
    version: string;
    defaultEnv: string;
}