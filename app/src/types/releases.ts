export type Environment = "production" | "development" | "test";
export type VersionSetter = "klepper" | "sdk";

export enum RELEASE_STATUS {
  ACTIVE = "active",
  CLOSED = "closed",
  INACTIVE = "inactive"
}

export interface Release {
  id: string;
  status: RELEASE_STATUS;
  appId: string;
  env: Environment;
  version: string;
  createdAt: number;
  updatedAt: number;
  os: Platform;
  incidentsCount?: number;
  incidentsOccurCount?: number;
  deployments?: Deployment[];
  lastDeploymentAt: number;
  changelog: string;
}

export interface Deployment {
  deployedAt: number;
  os: Platform;
}

export interface Platform {
  arch: string;
  platform: string;
  release: string;
  version: string;
}

export interface ReleaseUpdateProps {
  version?: string;
  status?: string | RELEASE_STATUS;
  changelog?: string;
}
