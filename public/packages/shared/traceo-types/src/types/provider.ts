import { CONNECTION_STATUS } from "./tsdb";

export interface BaseProviderDto {
    connStatus: CONNECTION_STATUS;
    connError: string;
}