import { Dictionary } from ".";

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
  // Timestamp in string without miliseconds eq. 25.03.2023, 21:42:08
  timestamp: string;
  // Precise timestamp in unix
  precise_timestamp: number;
  // Timestamp of receiving log from sdk/kafka
  receive_timestamp: number;
  level: LogLevel;
  application_id: string;
  // JSON object with some informations from SDK saved as string to clickhouse
  resources: string;
}

/**
 * Payload incoming from SDK
 *
 * TODO: unix -> precise_timestamp
 */
export interface LogEventPayload {
  message: string;
  level: LogLevel;

  // timestamp with DD.MM.YYYY HH:mm:ss
  // to take miliseconds use unix field
  timestamp: string;
  receiveTimestamp: number;
  // TODO: precise timestamp
  unix: number;

  // Information about eq. application like packageVersion
  resources: Dictionary<string>;
}

export interface LogsQuery {
  // application id
  id: number;
  from: number;
  to: number;
  levels: LogLevel[];
}
