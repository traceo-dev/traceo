import { InfluxDS } from "../../../lib/db/entities/influxds.entity";
import { MemberRole } from "../enums/amr.enum";
import { CONNECTION_STATUS, TSDB } from "../enums/tsdb.enum";
import { IAccount } from "./account.interface";
import { IAmr } from "./amr.interface";
import { IIncident } from "./incident.interface";
import { IRuntime } from "./runtime.interface";

export interface IApplication {
    id?: number;
    name: string;
    privateKey: string;
    dsn?: string;
    owner: IAccount;
    aboutDescription?: string;
    gravatar?: string;
    lastIncidentAt?: number;
    members?: IAmr[];
    membersCount?: number;
    incidents?: IIncident[];
    incidentsCount?: number;
    errorsCount?: number;
    runtimeData?: IRuntime[];
    influxDS?: InfluxDS;
    connectedTSDB?: TSDB;
    isIntegrated: boolean;
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
