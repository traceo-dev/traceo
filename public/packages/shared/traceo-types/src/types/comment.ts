import { IIncident } from "./incident";
import { IUser } from "./user";

export interface IComment {
  id?: string;
  message: string;
  lastUpdateAt?: number;
  removed: boolean;
  incident: IIncident;
  createdAt?: number;
  sender: IUser;
}
