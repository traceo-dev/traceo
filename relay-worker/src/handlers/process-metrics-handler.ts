import { Core, RelayEventType } from "../types";
import { MetricData, TraceoMetric } from "@traceo/types";
import { Logger } from "../logger";

export const handleMetricsEvent = async (core: Core, message: string): Promise<any> => {
    Logger.log("☢ Processing incoming metrics event from kafka ...")
    const db = core.db;

    try {
        const metrics = JSON.parse(message) as RelayEventType<TraceoMetric[]>;

        const payload = metrics.payload;
        const project_id = metrics.projectId;

        if (!project_id) {
            Logger.error('Cannot process incoming metrics without project id!');
            return;
        }

        const count = await db.insertClickhouseMetrics({ project_id, payload })

        Logger.log(`✔ Inserted ${count} metrics to Clickhuse for project: ${project_id}`)

        return count;
    } catch (error) {
        Logger.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}
