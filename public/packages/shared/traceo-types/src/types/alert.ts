import { IMember } from "./member";
import { ProjectMember } from "./project";

export enum AlertStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    MUTED = "muted"
}

export enum AlertSeverity {
    INFO = "info",
    WARNING = "warning",
    CRITICAL = "critical"
}

export enum AlertEnumType {
    INCIDENT = "incident",
    PERFORMANCE = "performance",
    METRIC = "metric",
    LOGS = "logs"
}

export enum OperatorEnum {
    STARTS_WITH = "starts_with",
    LIKE = "like",
    EQUALS = "equals"
}

export enum LogicOperator {
    ALL = "all",
    ANY = "any"
}

export enum TimeUnit {
    HOURS = "hours",
    MINUTES = "min",
    DAYS = "days"
}

export interface IAlertRule {
    id: string;

    lastTriggered: number;

    type: string;

    field: string;

    operator: string;

    value: string;

    count: number;

    // value provided in minutes
    time: number;

    incidentId: string;

    metricId: string;

    createdAt?: number;
}

export interface IAlert {
    id: string;

    lastTriggered: number;

    // time when alert should change status from muted to active
    mutedEndAt: number;

    status: AlertStatus;

    type: AlertEnumType;

    name: string;

    description: string;

    severity: AlertSeverity;

    logicOperator: LogicOperator;

    inAppNotification: boolean;

    emailNotification: boolean;

    minTimeInterval: number;

    rules: IAlertRule[];

    history: IAlertHistory[];

    recipients: IMember[];

    createdAt?: number;
}

export interface IAlertHistory {
    id: string;

    reason: string;

    triggeredAt: number;

    createdAt?: number;

    alert: IAlert;
}