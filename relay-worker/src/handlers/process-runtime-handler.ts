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
        const app_id = logsEvent.appId;

        const ret = await db.insertRuntimeConfigs({ config: payload, appId: app_id });

        logger.log(`✔ Runtime configuration inserted to application: ${app_id}`);
        return ret;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}