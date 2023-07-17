import { IIncident, IncidentEventPayload, IncidentStatus, SDK } from "@traceo/types";
import dayjs from "dayjs";
import { DatabaseService } from "../db/database";
import { Core, RelayEventType } from "../types";
import { Logger } from "../logger";

type IncidentEvent = RelayEventType<IncidentEventPayload>;

export const handleIncidentEvent = async (core: Core, message: string): Promise<void> => {
    Logger.log("☢ Processing incoming incident event from kafka ...")

    try {
        const incidentEvent = JSON.parse(message) as IncidentEvent;
        await captureEvent(incidentEvent, core.db);
    } catch (error) {
        Logger.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}

const captureEvent = async ({
    projectId: project_id,
    sdk,
    payload
}: IncidentEvent, db: DatabaseService) => {
    const now = dayjs().unix();

    const project = await db.getProjectById(project_id);

    if (!project) {
        Logger.error(`❌ Cannot process incident event. Caused by: Cannot find project with provided id: ${project_id}.`);
        return;
    }

    const incident = await db.getIncident({
        name: payload.name,
        message: payload.message,
        projectId: project_id
    });

    if (!incident) {
        const incident: Partial<IIncident> = {
            ...payload,
            sdk: sdk as SDK,
            status: IncidentStatus.UNRESOLVED,
            project: project,
            createdAt: now,
            name: payload.name,
        };

        await db.createIncident(incident, payload);

        Logger.log(`✔ New incident created for project: ${project_id}, sdk: ${sdk}, name: ${payload["type"]}`);

        return;
    }

    const event = await db.createEvent({
        precise_timestamp: now,
        incident_id: incident.id,
        project_id: project.id,
        details: payload?.details || undefined,
    });

    Logger.log(`✔ Created new Event: ${event.id} for incident: ${incident.id}`)

    return event;
}