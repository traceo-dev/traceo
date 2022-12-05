import { MemberRole } from "../enums/amr.enum";
import { CONNECTION_STATUS, TSDB } from "../enums/tsdb.enum";
import { IAccount } from "./account.interface";
import { IAmr } from "./amr.interface";
import { IIncident } from "./incident.interface";
import { IInfluxDs } from "./influxds.interface";
import { IRuntime } from "./runtime.interface";

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
    connectedTSDB?: TSDB;
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
