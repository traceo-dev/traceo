import { ConnectionStatus } from "./tsdb";

export enum DatasourceProvider {
    INLFUX_DB = 'influxdb'
}

export interface IDatasource {
    id: string;
    appId: string;
    createdAt?: number;
    updatedAt?: number;
    name: string;
    type: DatasourceProvider;
    url: string;
    details: { [key: string]: any };
}
