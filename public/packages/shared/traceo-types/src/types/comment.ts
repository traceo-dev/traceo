import { IUser } from "./user";
import { IIncident } from "./incident";

export interface IComment {
    id?: string;
    message: string;
    lastUpdateAt?: number;
    removed: boolean;
    incident: IIncident;
    createdAt?: number;
    sender: IUser;
}