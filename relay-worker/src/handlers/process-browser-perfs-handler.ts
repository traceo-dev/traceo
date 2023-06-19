import { BrowserPerfsPayloadEvent } from "@traceo/types";
import { Core, RelayEventType } from "../types";

export const handleBrowserPerformance = async (core: Core, message: string): Promise<any> => {
    console.info("☢ Processing incoming browser performance event from kafka ...")

    try {
        const browserPayload = JSON.parse(message) as RelayEventType<BrowserPerfsPayloadEvent[]>;
        const project_id = browserPayload.projectId;
        const payload = browserPayload.payload;

        const count = await core.db.insertClickhouseBrowserPerformance({ projectId: project_id, payload })
        console.info(`✔ Inserted ${count} browser perfomances for project: ${project_id}`);

        return count;
    } catch (error) {
        console.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}