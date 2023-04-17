import { ProjectMember } from "@traceo/types";
import { SelectOptionProps } from "@traceo/ui";

export interface Condition {
    uuid?: string;
    type?: string; //enum
    [x: string]: any;
}

export interface AlertRule {
    type: AlertEnumType;
    name: string;
    description: string;
    severity: string; //enum
    logicOperator: string; //enum
    conditions: Condition[];
    recipients: ProjectMember[];
    isForAllMembers?: boolean;
    notifications: {
        in_app: boolean;
        email: boolean;
    }
}

export enum AlertEnumType {
    INCIDENT = "incident",
    PERFORMANCE = "performance",
    METRIC = "metric",
    LOGS = "logs"
}

export enum IncidentPrimaryCondition {
    OCCUR_NEW_INCIDENT = "occur_new_incident",
    OCCUR_NEW_INCIDENT_WITH = "occur_new_incident_with",
    OCCUR_MORE_THAN = "occur_more_than",
    INCIDENT_CHANGED_STATUS = "incident_changed_status",
    EVENTS_NUMBER_INTERVAL = "events_number_interval"
}

export enum OperatorEnum {
    STARTS_WITH = "starts_with",
    LIKE = "like",
    EQUALS = "equals"
}

export const OPERATOR_OPTIONS: SelectOptionProps[] = [
    { label: "starts with", value: OperatorEnum.STARTS_WITH },
    { label: "like", value: OperatorEnum.LIKE },
    { label: "equals", value: OperatorEnum.EQUALS }
];

export enum IncidentField {
    NAME = "name",
    MESSAGE = "message"
}

export const INCIDENT_FIELD_OPTIONS: SelectOptionProps[] = [
    { label: "name", value: IncidentField.NAME },
    { label: "message", value: IncidentField.MESSAGE }
];

export enum TimeUnit {
    HOURS = "hours",
    MINUTES = "min",
    DAYS = "days"
}

export const TIME_UNIT_OPTIONS: SelectOptionProps[] = [
    { label: "hours", value: TimeUnit.HOURS },
    { label: "minutes", value: TimeUnit.MINUTES },
    { label: "days", value: TimeUnit.DAYS }
];

export const TIME_OPTIONS: SelectOptionProps[] = [
    { label: "15 minutes", value: 15 },
    { label: "30 mintues", value: 30 },
    { label: "60 mintues", value: 60 },
    { label: "2 hours", value: 120 },
    { label: "3 hours", value: 180 },
    { label: "6 hours", value: 360 },
    { label: "12 hours", value: 720 },
    { label: "24 hours", value: 1440 },
    { label: "2 days", value: 2880 },
    { label: "3 days", value: 4320 }
]

// all -> AND, any -> OR
export enum LogicOperator {
    ALL = "all",
    ANY = "any"
}

export const LOGICAL_OPERATORS_OPTIONS: SelectOptionProps[] = [
    { label: "all", value: LogicOperator.ALL },
    { label: "any", value: LogicOperator.ANY }
];
