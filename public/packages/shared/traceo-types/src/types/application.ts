import { IUser } from "./user";
import { MemberRole } from "./member";
import { SortOrder } from "./api";
import { IInfluxConfigDto } from "./influxds";
import { TsdbProvider, ConnectionStatus } from "./tsdb";

export interface IApplication {
    id?: string;
    name: string;
    technology: ApplicationTechnology;
    owner: Owner;
    gravatar?: string;
    lastIncidentAt?: number;
    incidentsCount: number;
    errorsCount: number;
    membersCount: number;
    createdAt?: number;
    updatedAt?: number;
    tsdbProvider?: TsdbProvider;
    influxConfig?: IInfluxConfigDto;
    isIntegrated: boolean;
    runtimeConfig?: {
        data: { [key: string]: any }
    }
    security?: {
        apiKey: string;
        lastUpdate: number;
        generatedBy: string;
    }
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
        connStatus: ConnectionStatus;
        connError?: string;
    },
    owner?: {
        name: string;
    }
}

export interface Owner {
    name: string;
    email: string;
    username: string;
}

export interface AddUserToApplication {
    role: {
        value: MemberRole
    };
    application: {
        value: string
    };
    userId: string;
}

export interface ApplicationMemberUpdateProps {
    memberId: string;
    role: MemberRole;
}

export type ApplicationMember = {
    id: string;
    userId: string;
    role: MemberRole;
} & IUser;

export type MemberApplication = {
    id: string;
    appId: string;
    role: MemberRole
} & IApplication;

export type CreateApplicationProps = Pick<IApplication, "name" | "technology" | "tsdbProvider"> & {
    tsdbConfiguration: {
        influx: IInfluxConfigDto;
    };
};
export type UpdateApplicationProps = Pick<IApplication, "name">;

export interface SearchApplicationQueryParams {
    order?: SortOrder;
    sortBy?: string;
    search?: string;
    userId?: string;
}

export enum ApplicationTechnology {
    NODEJS = "nodejs"
}