import { Environment } from "src/core/generic.model";
import { MEMBER_STATUS } from "src/db/entities/account-member-relationship.entity";
import { GithubRepository } from "./github";

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
    github?: GithubRepository;
}

export interface ApplicationResponse extends Application {
    member: {
        status: MEMBER_STATUS
    };
}