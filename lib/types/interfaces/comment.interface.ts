import { Incident } from "../../../lib/db/entities/incident.entity";
import { IAccount } from "./account.interface";

export interface IComment {
    id?: string;
    message: string;
    sender: IAccount;
    lastUpdateAt?: number;
    removed: boolean;
    incident: Incident;
}