import { Logger } from "../logger";
import { Core, RelayEventType } from "../types";
import { TraceoSpan } from "@traceo/types";

export const handleTracesEvent = async (core: Core, message: string): Promise<any> => {
    Logger.log("☢ Processing incoming trace event from kafka ...")
    const db = core.db;

    try {
        const tracingEvent = JSON.parse(message) as RelayEventType<TraceoSpan[]>;

        const payload = tracingEvent.payload;
        const project_id = tracingEvent.projectId;

        const rowsCount = await db.insertClickhouseSpans({
            project_id,
            payload
        });

        Logger.log(`✔ Inserted ${rowsCount} spans to project: ${project_id}`);

        return rowsCount;
    } catch (error) {
        Logger.error(`❌ Cannot process incoming trace event. Caused by: ${error}`);
        throw error;
    }
}
