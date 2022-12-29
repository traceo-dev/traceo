export type METRIC_UNIT = "%" | "MB" | "kb" | "s" | "ms" | "";

export enum TSDB_PROVIDER {
    INFLUX = "influx",
    INFLUX2 = "influx2",
    PROMETHEUS = "prometheus"
}

export interface InfluxDS {
    url: string;
    org: string;
    bucket: string;
    token: string;
    connStatus: CONNECTION_STATUS;
    connError: string;
}

export enum CONNECTION_STATUS {
    CONNECTED = "connected",
    FAILED = "failed"
}

export interface DataSourceConnStatus {
    status: CONNECTION_STATUS;
    error: string;
}

export interface MetricsResponse {
    cpuUsage: number;
    memoryUsage: number;
    _time: string;
    id?: string;
    heapUsed: number;
    heapTotal: number;
    heapNativeContexts: number;
    heapDetachedContexts: number;
    loopMin: number;
    loopMax: number;
    loopMean: number;
    rss: number;
    gcTotalTime: number;
    gcAvgTime: number;
}