export enum TSDB_PROVIDER {
    INFLUX = "influx",
    INFLUX2 = "influx2",
    PROMETHEUS = "prometheus"
}

export enum CONNECTION_STATUS {
    CONNECTED = "connected",
    FAILED = "failed"
}

export interface DataSourceConnStatus {
    status: CONNECTION_STATUS;
    error?: string;
}

export interface InfluxDS {
    url: string;
    org: string;
    bucket: string;
    token: string;
    connStatus: CONNECTION_STATUS;
    connError: string;
}
