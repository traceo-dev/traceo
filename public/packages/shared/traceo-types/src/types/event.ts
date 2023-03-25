import { IApplication } from "./application";
import { IIncident, IncidentEventPayload } from "./incident";

export interface IEvent extends Pick<IncidentEventPayload, "browser"> {
    id: string;
    date: number;
    incident: IIncident;
    application: IApplication;
}