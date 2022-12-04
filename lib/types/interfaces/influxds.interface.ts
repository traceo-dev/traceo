import { CONNECTION_STATUS } from "../enums/tsdb.enum";
import { IApplication } from "./application.interface";

export interface IInfluxDs {
    id?: string;
    url: string;
    token: string;
    org: string;
    bucket: string;
    connStatus: CONNECTION_STATUS;
    connError: string;
    application: IApplication;
}

export interface InfluxConfiguration extends Omit<IInfluxDs, "application" | "connError" | "id"> {
    url: string;
    token: string;
    org: string;
    bucket: string;
    appId: string;
    connStatus: CONNECTION_STATUS;
}
