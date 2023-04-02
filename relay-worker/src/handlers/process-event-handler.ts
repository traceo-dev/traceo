import { ExceptionHandlers } from "@traceo-sdk/node";
import { IIncident, IncidentEventPayload, IncidentStatus, SDK } from "@traceo/types";
import dayjs from "dayjs";
import { PoolClient } from "pg";
import { DatabaseService } from "../db/database";
import { Core, RelayEventType } from "../types";
import { logger } from "..";

type IncidentEvent = RelayEventType<IncidentEventPayload>;

export const handleIncidentEvent = async (core: Core, message: string) => {
    logger.info("☢ Processing incoming incident event from kafka ...")

    try {
        const incidentEvent = JSON.parse(message) as IncidentEvent;
        const event = await captureEvent(incidentEvent, core.db);

        return event;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}

const captureEvent = async ({
    projectId: project_id,
    sdk,
    payload
}: IncidentEvent, db: DatabaseService) => {
    const now = dayjs().unix();

    const processedIncident = await db.postgresTransaction(async (client: PoolClient) => {
        const project = await db.getProjectById(project_id, client);

        if (!project) {
            logger.error(`❌ Cannot process incident event. Caused by: Cannot find project with provided id: ${project_id}.`);
            return;
        }

        const incident = await db.getIncident({
            name: payload.name,
            message: payload.message,
            projectId: project_id
        }, client);

        if (!incident) {
            const incident: Partial<IIncident> = {
                ...payload,
                sdk: sdk as SDK,
                status: IncidentStatus.UNRESOLVED,
                project: project,
                createdAt: now,
                name: payload.name,
            };

            await db.createIncident(incident, payload, client);

            logger.info(`✔ New incident created for project: ${project_id}, sdk: ${sdk}, name: ${payload["type"]}`);

            return;
        }

        const event = await db.createEvent({
            date: now,
            incident,
            project: project,

            details: payload?.details || undefined,
        }, client);


        if (!event) {
            // Rollback whole transaction if event has not been saved to postgres
            await client.query('ROLLBACK');

            logger.error('❌ Event has not been properly saved to database. Transaction has been rolled back.');

            return;
        }

        logger.info(`✔ Created new Event: ${event.id} for incident: ${incident.id}`)
    });

    return processedIncident;
}