import { IUser } from "./user";

export type EnvType = "development" | "production";

export interface ViewConfigData {
  user: Partial<IUser>;
  demoMode: boolean;
  env: EnvType;
}
