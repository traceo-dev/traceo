import { IAccount } from "./account";
import { IAmr, MemberRole } from "./amr";
import { SortOrder } from "./api";
import { IIncident } from "./incident";
import { IInfluxDs } from "./influxds";
import { IRuntime } from "./runtime";
import { TSDB_PROVIDER, CONNECTION_STATUS } from "./tsdb";

export interface IApplication {
    id?: string;
    name: string;
    owner: IAccount;
    gravatar?: string;
    lastIncidentAt?: number;
    members?: IAmr[];
    membersCount?: number;
    incidents?: IIncident[];
    incidentsCount?: number;
    errorsCount?: number;
    runtimeConfig?: IRuntime;
    influxDS?: IInfluxDs;
    connectedTSDB?: TSDB_PROVIDER;
    isIntegrated: boolean;
    security?: ISecurity;
}

export interface ISecurity {
    apiKey: string;
    lastUpdate: number;
    generatedBy: string;
}

export interface IApplicationResponse extends Omit<IApplication, "influxDS" | "owner"> {
    member: {
        role: MemberRole;
    },
    influxDS?: {
        connStatus: CONNECTION_STATUS;
        connError?: string;
    },
    owner?: {
        name: string;
    }
}

export interface OwnerAccount {
    name: string;
    email: string;
    username: string;
}

export enum TSDB {
    INFLUX = "influx",
    INFLUX2 = "influx2",
    PROMETHEUS = "prometheus"
}

export interface Application {
    id?: string;
    name: string;
    dsn?: string;
    owner: OwnerAccount;
    gravatar?: string;
    lastIncidentAt?: number;
    incidentsCount: number;
    errorsCount: number;
    membersCount: number;
    createdAt: number;
    updatedAt: number;
    connectedTSDB?: TSDB;
    influxDS: IInfluxDs;
    isIntegrated: boolean;
    runtimeConfig: {
        data: { [key: string]: any }
    }
    security: {
        apiKey: string;
        lastUpdate: number;
        generatedBy: string;
    }
}

export interface AddAccountToApplication {
    role: {
        value: MemberRole
    };
    application: {
        value: string
    };
    accountId: string;
}

export interface ApplicationMemberUpdateProps {
    memberId: string;
    role: MemberRole;
}

export type ApplicationMember = {
    id: string;
    accountId: string;
    role: MemberRole;
} & IAccount;

export type MemberApplication = {
    id: string;
    appId: string;
    role: MemberRole
} & Application;

export type CreateApplicationProps = Pick<Application, "name">;
export type UpdateApplicationProps = Pick<Application, "name">;

export interface SearchApplicationQueryParams {
    order?: SortOrder;
    sortBy?: string;
    search?: string;
    accountId?: string;
}

