import { IncidentEventPayload } from "./incident";

export interface IEvent extends Pick<IncidentEventPayload, "details"> {
    id: string;
    timestamp?: number;
    precise_timestamp: number;
    incident_id: string;
    project_id: string;
}