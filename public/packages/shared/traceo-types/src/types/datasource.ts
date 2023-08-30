import { IProject } from "./project";

export enum DATASOURCE_PROVIDER {
    HTTP,
    MONGODB,
    POSTGRESQL,
    MYSQL,
    CLICKHOUSE
}

export interface IDatasource {
    id?: string;
    name: string;
    config: string;
    type: DATASOURCE_PROVIDER;
    createdAt?: number;
    updatedAt?: number;
    project: IProject;
}

export enum AUTH_ENUM {
    NO_AUTH = "no_auth",
    BEARER_TOKEN = "bearer_token",
    API_KEY = "api_key",
    BASIC_AUTH = "basic_auth"
}

export enum API_KEY_ENUM {
    HEADER = "header",
    PARAM = "param"
}

export type HttpFormType = {
    name: string;
    url: string;
    auth: {
        type: AUTH_ENUM;
        bearer: string;
        api: {
            key: string;
            value: string;
            type: API_KEY_ENUM;
        };
        basic: {
            username: string;
            password: string;
        };
    };
};

