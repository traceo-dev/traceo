import { LogEventPayload } from "@traceo/types";
import { Core, RelayEventType } from "../types";
import { Logger } from "../logger";

export const handleLogsEvent = async (core: Core, message: string): Promise<any> => {
    Logger.log("☢ Processing incoming logs event from kafka ...")

    const db = core.db;

    try {
        const logsEvent = JSON.parse(message) as RelayEventType<LogEventPayload[]>;

        const payload = logsEvent.payload;
        const project_id = logsEvent.projectId;

        const rowsCount = await db.insertClickhouseLogs({ logs: payload, projectId: project_id })
        Logger.log(`✔ Inserted ${rowsCount} logs to project: ${project_id}`);

        return rowsCount;
    } catch (error) {
        Logger.error(`❌ Cannot process incoming event. Caused by: ${error}`);
        throw error;
    }
}