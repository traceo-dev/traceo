import { CONNECTION_STATUS } from "../enums/tsdb.enum";

export interface IInfluxDs {
    url?: string;
    token?: string;
    org?: string;
    bucket?: string;
    connStatus?: CONNECTION_STATUS;
    connError?: string;
}

export interface InfluxConfiguration extends Omit<IInfluxDs, "application" | "connError" | "id"> {
    url: string;
    token: string;
    org: string;
    bucket: string;
    appId: string;
    connStatus: CONNECTION_STATUS;
}
