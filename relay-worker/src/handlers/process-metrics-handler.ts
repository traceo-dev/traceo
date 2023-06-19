import { Core, RelayEventType } from "../types";
import { MetricData } from "@traceo/types";

export const handleMetricsEvent = async (core: Core, message: string): Promise<any> => {
    console.info("☢ Processing incoming metrics event from kafka ...")
    const db = core.db;

    try {
        const metrics = JSON.parse(message) as RelayEventType<MetricData[]>;

        const payload = metrics.payload;
        const project_id = metrics.projectId;

        if (!project_id) {
            console.error('Cannot process incoming metrics without project id!');
            return;
        }

        const count = await db.insertClickhouseMetrics({ project_id, payload })

        console.log(`✔ Inserted ${count} metrics to Clickhuse for project: ${project_id}`)

        return count;
    } catch (error) {
        console.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}
