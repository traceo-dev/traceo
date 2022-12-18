import { LogLevel } from "../enums/log.enum";
import { IApplication } from "./application.interface";

export interface ILog {
    id?: string;
    message: string;
    timestamp: string;
    receiveTimestamp: number;
    resources: object;
    level: LogLevel;
    application: IApplication;
}

export interface TraceoLog {
    timestamp: string;
    message: string;
    level: LogLevel;
    unix: number;
    resources: { [key: string]: string; }
}

export interface ApplicationLogsQuery {
    id: number;
    startDate: number;
    endDate: number;
}