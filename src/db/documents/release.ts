import { ObjectId } from "mongodb";

export type Environment = "prod" | "dev";
export type VersionSetter = "klepper" | "sdk";

export interface Release {
    _id: ObjectId;
    appId: string;
    env: Environment,
    version: string;
    versionSetter: VersionSetter,
    createdAt: number
}