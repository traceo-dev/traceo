import { BaseProviderDto } from "./provider";

export interface IInfluxDs extends BaseProviderDto {
    url?: string;
    token?: string;
    org?: string;
    bucket?: string;
}
