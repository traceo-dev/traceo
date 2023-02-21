import { IApplication } from "./application";

export enum LogLevel {
  Debug = "debug",
  Log = "log",
  Info = "info",
  Warn = "warn",
  Error = "error"
}

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
  receiveTimestamp: number;
  message: string;
  level: LogLevel;
  unix: number;
  resources: { [key: string]: string };
}

export interface ApplicationLogsQuery {
  id: number;
  startDate: number;
  endDate: number;
  levels: LogLevel[];
}
