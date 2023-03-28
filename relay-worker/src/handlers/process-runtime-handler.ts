import { ExceptionHandlers } from "@traceo-sdk/node";
import { RuntimeEventPayload } from "@traceo/types";
import { logger } from "..";
import { Core, RelayEventType } from "../types";

export const handleRuntimeEvent = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming runtime event from kafka ...")
    const db = core.db;

    try {
        const logsEvent = JSON.parse(message) as RelayEventType<RuntimeEventPayload>;

        const payload = logsEvent.payload;
        const project_id = logsEvent.projectId;

        const ret = await db.insertRuntimeConfigs({ config: payload, projectId: project_id });

        logger.log(`✔ Runtime configuration inserted to project: ${project_id}`);
        return ret;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}