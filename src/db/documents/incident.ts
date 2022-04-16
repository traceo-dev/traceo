export interface Incident {
    type: string;
    message: string;
    date: number;
    stack: string;
    traces?: Trace[];
    projectId?: string;
    requestData?: KlepperRequest;
    catchType?: CatchType;
    options?: {
        priority?: ExceptionPriority;
        tag?: string;
    };
    persist?: boolean;
}

export class KlepperRequest {
    payload?: Object;
    headers?: Object;
    query?: Object;
    url?: Object;
    method?: RequestMethodType;
    ip?: string | string[] | undefined;
}

export type RequestMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export enum CatchType {
    /**
     * Exception handled by middleware, eq. Middleware.errorMiddleware()
     */
    MIDDLEWARE = "middleware",

    /**
     * Exception handled by function catchException() in interceptors or try/catch clause
     */
    INTERNAL = "internal",
}

export enum ExceptionPriority {
    MINOR = "minor",
    IMPORTANT = "important",
    CRITICAL = "critical",
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
