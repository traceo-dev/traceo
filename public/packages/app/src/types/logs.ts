export enum LogLevel {
    Log = "log",
    Error = "error",
    Warn = "warn",
    Debug = "debug",
    Info = "info"
}

export interface TraceoLog {
    timestamp: string;
    receiveTimestamp: number;
    message: string;
    level: LogLevel;
    resources: { [key: string]: string }
}