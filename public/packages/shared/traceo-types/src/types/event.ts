import { IProject } from "./project";
import { IIncident, IncidentEventPayload } from "./incident";

export interface IEvent extends Pick<IncidentEventPayload, "browser"> {
    id: string;
    date: number;
    incident: IIncident;
    project: IProject;
}