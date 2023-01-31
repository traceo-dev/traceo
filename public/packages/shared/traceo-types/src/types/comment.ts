import { IAccount } from "./account";
import { IIncident } from "./incident";

export interface IComment {
    id?: string;
    message: string;
    lastUpdateAt?: number;
    removed: boolean;
    incident: IIncident;
    createdAt?: number;
    sender: IAccount;
}