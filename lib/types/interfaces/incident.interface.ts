import { CatchType, ExceptionPriority, IncidentStatus } from "../enums/incident.enum";
import { IAccount } from "./account.interface";
import { IApplication } from "./application.interface";
import { IComment } from "./comment.interface";

export interface IIncident {
    id?: string;
    status: IncidentStatus;
    stack: string;
    type: string;
    message: string;
    lastError: number;
    errorsCount: number;
    application: IApplication;
    assigned: IAccount;
    comments: IComment[];
    commentsCount: number;
    platform: Platform;
    errorsDetails: Array<ErrorDetails>;
    traces: Array<Trace>;
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

export interface StackFrame {
    filename?: string;
    function?: string;
    lineNo?: number;
    columnNo?: number;
    internal?: boolean;
    absPath?: string;
    extension?: string;
}

export interface Platform {
    arch: string;
    platform: string;
    release: string;
    version: string;
}

export interface Trace {
    filename?: string;
    function?: string;
    lineNo?: number;
    columnNo?: number;
    internal?: boolean;
    absPath?: string;
    extension?: string;
    code: string;
    preCode: string[];
    postCode: string[];
}

export interface ErrorDetails {
    date: number;
}

export interface IncidentExistsPayload {
    appId: string;
    incident: TraceoIncidentModel;
}
