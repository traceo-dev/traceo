import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from "..";
import { Core, RelayEventType } from "../types";
import { ReadableSpan } from "@traceo/types";

export const handleTracesEvent = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming trace event from kafka ...")
    const db = core.db;

    try {
        const tracingEvent = JSON.parse(message) as RelayEventType<ReadableSpan[]>;

        const payload = tracingEvent.payload;
        const project_id = tracingEvent.projectId;

        const rowsCount = await db.insertClickhouseSpans({
            project_id,
            payload
        });

        logger.log(`✔ Inserted ${rowsCount} spans to project: ${project_id}`);

        return rowsCount;
    } catch (error) {
        const message = `❌ Cannot process incoming trace event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}
