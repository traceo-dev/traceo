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

export enum IncidentStatus {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved",
    IN_PROGRESS = "in_progress"
}

export enum IncidentStatusSearch {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved",
    ARCHIVED = "archived",
    MUTED = "muted",
    ALL = "all",
}
