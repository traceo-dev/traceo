import { StackFrame, CatchType, ExceptionPriority } from "./incident";

export interface IncidentExistsPayload {
    appId: number;
    incident: TraceoIncidentModel;
}

export interface TraceoIncidentModel {
    type: string;
    message: string;
    date: number;
    stack: string;
    stackFrames?: StackFrame[];
    appId: string;
    catchType?: CatchType;
    options?: {
        priority?: ExceptionPriority;
        tag?: string;
    };
    persist?: boolean;
}

export enum LogLevel {
    Debug = "debug",
    Log = "log",
    Info = "info",
    Warn = "warn",
    Error = "error"
}

export interface TraceoLog {
    timestamp: string;
    message: string;
    level: LogLevel;
    unix: number;
    resources: { [key: string]: string; }
}

export interface Metrics {
    cpuUsage: number;
    memory: {
      mb: number;
      percentage: number;
    };
    loadAvg?: number;
}
