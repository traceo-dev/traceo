export enum TsdbProvider {
  INFLUX = "influx",
  INFLUX2 = "influx2",
  PROMETHEUS = "prometheus"
}

export enum ConnectionStatus {
  CONNECTED = "connected",
  FAILED = "failed"
}

export interface DataSourceConnStatus {
  status: ConnectionStatus;
  error?: string;
}

export interface InfluxDS {
  url: string;
  org: string;
  bucket: string;
  token: string;
  connStatus: ConnectionStatus;
  connError: string;
}
