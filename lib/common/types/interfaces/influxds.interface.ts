import { BaseProviderDto } from "./provider.interface";

export interface IInfluxDs extends BaseProviderDto {
    url?: string;
    token?: string;
    org?: string;
    bucket?: string;
}
