import { ConnectionStatus } from "./tsdb";

export interface BaseProviderDto {
    connStatus: ConnectionStatus;
    connError: string;
}