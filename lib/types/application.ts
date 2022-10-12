import { MemberRole } from "lib/db/entities/account-member-relationship.entity";
import { CONNECTION_STATUS } from "./tsdb";

export interface OwnerAccount {
  name: string;
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
}

export interface ApplicationResponse extends Application {
  member: {
    role: MemberRole;
  },
  influxDS?: {
    connStatus: CONNECTION_STATUS;
    connError?: string;
  }
}
