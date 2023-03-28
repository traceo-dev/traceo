import { ExceptionHandlers } from "@traceo-sdk/node";
import { MetricsEventPayload } from "@traceo/types";
import { logger } from "..";
import { Core, RelayEventType } from "../types";

export const handleMetricsEvent = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming metrics event from kafka ...")
    const db = core.db;

    try {
        const logsEvent = JSON.parse(message) as RelayEventType<MetricsEventPayload>;

        const payload = logsEvent.payload;
        const project_id = logsEvent.projectId;

        if (!project_id) {
            const msg = 'Cannot process incoming metrics without project id!'
            ExceptionHandlers.catchException(msg);
            return;
        }

        const count = await db.insertClickhouseMetrics({ project_id, payload })

        logger.log(`✔ Inserted ${count} metrics to Clickhuse for project: ${project_id}`)

        return count;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}
