import { ObjectId } from "mongodb";

export type Environment = "prod" | "dev";
export type VersionSetter = "klepper" | "sdk";

export interface Release {
    _id: string;
    appId: string;
    env: Environment,
    version: string;
    versionSetter: VersionSetter,
    createdAt: number,
    os: Platform;
    incidentsCount?: number;
    incidentsOccurCount?: number;
    deployments?: Deployment[];
    lastDeploymentAt: number;
}

export interface Deployment {
    deployedAt: number;
    os: Platform;
}

export interface Platform {
    arch: string,
    platform: string,
    release: string,
    version: string
}

export interface WorkspaceRelease {
    release: Release,
    totalIncidentsCount: number,
    totalIncidentsOccurCount: number
}