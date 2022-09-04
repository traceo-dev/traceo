import { Environment } from "src/core/generic.model";
import { MEMBER_STATUS } from "src/db/entities/account-member-relationship.entity";

export interface OwnerAccount {
    name: string;
    logo: string;
}

export interface Application {
    id?: number;
    name: string;
    dsn?: string;
    owner: OwnerAccount;
    technology?: string;
    framework?: string;
    logo?: string;
    lastIncidentAt?: number;
    defaultEnv?: Environment;
}

export interface ApplicationResponse extends Application {
    member: {
        status: MEMBER_STATUS
    };
}