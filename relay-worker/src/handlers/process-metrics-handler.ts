import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from "..";
import { Core, RelayEventType } from "../types";
import { MetricData } from "@traceo/types";

export const handleMetricsEvent = async (core: Core, message: string): Promise<any> => {
    logger.info("☢ Processing incoming metrics event from kafka ...")
    const db = core.db;

    try {
        const metrics = JSON.parse(message) as RelayEventType<MetricData[]>;

        const payload = metrics.payload;
        const project_id = metrics.projectId;

        if (!project_id) {
            const msg = 'Cannot process incoming metrics without project id!'
            ExceptionHandlers.catchException(new Error(msg));
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
