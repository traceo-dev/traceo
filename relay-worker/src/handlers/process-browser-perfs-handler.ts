import { BrowserPerfsPayloadEvent } from "@traceo/types";
import { Core, RelayEventType } from "../types";
import { Logger } from "../logger";

export const handleBrowserPerformance = async (core: Core, message: string): Promise<any> => {
    Logger.log("☢ Processing incoming browser performance event from kafka ...")

    try {
        const browserPayload = JSON.parse(message) as RelayEventType<BrowserPerfsPayloadEvent[]>;
        const project_id = browserPayload.projectId;
        const payload = browserPayload.payload;

        const count = await core.db.insertClickhouseBrowserPerformance({ projectId: project_id, payload })
        Logger.log(`✔ Inserted ${count} browser perfomances for project: ${project_id}`);

        return count;
    } catch (error) {
        Logger.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}