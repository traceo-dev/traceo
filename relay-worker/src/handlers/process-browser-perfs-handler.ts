import { ExceptionHandlers } from "@traceo-sdk/node";
import { BrowserPerfsPayloadEvent } from "@traceo/types";
import { Core, RelayEventType } from "../types";
import { logger } from "..";

export const handleBrowserPerformance = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming browser performance event from kafka ...")

    try {
        const browserPayload = JSON.parse(message) as RelayEventType<BrowserPerfsPayloadEvent[]>;
        const project_id = browserPayload.projectId;
        const payload = browserPayload.payload;

        const count = await core.db.insertClickhouseBrowserPerformance({ projectId: project_id, payload })
        logger.info(`✔ Inserted ${count} browser perfomances for project: ${project_id}`);

        return count;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}