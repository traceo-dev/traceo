import { ExceptionHandlers } from "@traceo-sdk/node";
import { LogEventPayload } from "@traceo/types";
import { KafkaMessage } from "kafkajs";
import { Core, RelayEventType } from "../types";
import { logger } from "..";

export const handleLogsEvent = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming logs event from kafka ...")

    const db = core.db;

    try {
        const logsEvent = JSON.parse(message) as RelayEventType<LogEventPayload[]>;

        const payload = logsEvent.payload;
        const project_id = logsEvent.projectId;

        const rowsCount = await db.insertClickhouseLogs({ logs: payload, projectId: project_id })
        logger.log(`✔ Inserted ${rowsCount} logs to project: ${project_id}`);

        return rowsCount;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}