import { IUser } from "./user";

export type EnvType = "development" | "production";

export type NavItem = {
  id: string;
  icon?: JSX.Element | string;
  label: string;
  subtitle?: string;
  url?: string;
  items?: NavItem[];
}

export interface ViewConfigData {
  user: Partial<IUser>;
  demoMode: boolean;
  env: EnvType;
  // Not used yet
  navTree: NavItem[];
}
