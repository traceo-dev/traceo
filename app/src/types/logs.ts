export enum LogLevel {
    Debug = "debug",
    Log = "log",
    Info = "info",
    Warn = "warn",
    Error = "error"
}

export interface TraceoLog {
    timestamp: string;
    receiveTimestamp: number;
    message: string;
    level: LogLevel;
    resources: {[key: string]: string}
}