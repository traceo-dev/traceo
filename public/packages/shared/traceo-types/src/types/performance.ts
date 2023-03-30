export enum VitalsEnum {
    FID = "FID",
    FCP = "FCP",
    FP = "FP",
    LCP = "LCP",
    CLS = "CLS"
}

export type VitalsBinType = {
    bin: number;
    count: number
}

export type VitalsResponse = {
    [x: string]: VitalsBinType[];
}

export type PerformanceQuery = {
    from: number;
    to: number;

    // List of names (like FID, CLS, FCP) from clickhouse performance table and name column
    fields: string[];
}

/**
 * Performance representation in clickhouse db
 */
export type Performance = {
    id: string;
    // Name of the saved performance data eq. FID, CLS, FCP
    name: string;
    value: number;
    // In long term definition eq. miliseconds, seconds etc.
    unit: string;
    // Name of the event used to scrap this data like: largest-contentful-paint, paint or navigation
    event: string;
    // Time when SDK fetch this data from browser
    timestamp: string;
    // Time when worker saved this data in db
    receive_timestamp: string;
    project_id: string;
}