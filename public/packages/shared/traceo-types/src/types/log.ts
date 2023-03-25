import { Dictionary } from ".";
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
  resources: object;
  level: LogLevel;
  application: IApplication;
}

export interface LogEventPayload {
  message: string;
  level: LogLevel;

  // timestamp with DD.MM.YYYY HH:mm:ss
  // to take miliseconds use unix field
  timestamp: string;
  receiveTimestamp: number;
  // TODO: ???
  unix: number;

  // Information about eq. application like packageVersion
  resources: Dictionary<string>;
}

export interface ApplicationLogsQuery {
  id: number;
  startDate: number;
  endDate: number;
  levels: LogLevel[];
}
