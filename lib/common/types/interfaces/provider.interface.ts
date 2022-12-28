import { CONNECTION_STATUS } from "../enums/tsdb.enum";

export interface BaseProviderDto {
    connStatus: CONNECTION_STATUS;
    connError: string;
}