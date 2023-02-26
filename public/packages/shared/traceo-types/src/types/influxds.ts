import { BaseProviderDto } from "./provider";

export interface IInfluxConfigDto extends BaseProviderDto {
  url?: string;
  token?: string;
  org?: string;
  bucket?: string;
}
