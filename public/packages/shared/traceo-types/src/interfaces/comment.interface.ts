import { IAccount } from "./account.interface";
import { IIncident } from "./incident.interface";

export interface IComment {
    id?: string;
    message: string;
    sender: IAccount;
    lastUpdateAt?: number;
    removed: boolean;
    incident: IIncident;
}