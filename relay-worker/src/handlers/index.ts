import { KafkaMessage } from "kafkajs";
import { KAFKA_TOPIC } from "@traceo/types";
import { handleIncidentEvent } from "./process-event-handler";
import { handleLogsEvent } from "./process-logs-handler";
import { Core } from "../types";
import { handleMetricsEvent } from "./process-metrics-handler";
import { handleBrowserPerformance } from "./process-browser-perfs-handler";
import { handleTracesEvent } from "./process-traces-handler";
import { Logger } from "../logger";

type EventHandlerType = {
    core: Core,
    topic: KAFKA_TOPIC,
    message: KafkaMessage
}

const handlers: Record<KAFKA_TOPIC, (core: Core, message: string) => Promise<void>> = {
    [KAFKA_TOPIC.INCIDENT_EVENT]: handleIncidentEvent,
    [KAFKA_TOPIC.LOGS_EVENT]: handleLogsEvent,
    [KAFKA_TOPIC.METRICS_EVENT]: handleMetricsEvent,
    [KAFKA_TOPIC.TRACING_EVENT]: handleTracesEvent,
    [KAFKA_TOPIC.BROWSER_PERFS_EVENT]: handleBrowserPerformance
};

export const eventHandler = async ({
    core,
    message,
    topic
}: EventHandlerType): Promise<void> => {
    const db = core.db;
    const kafkaMessage = message.value.toString();

    if (!db) {
        Logger.error(`❌ Database instance has not been properly initialized. Cannot process incoming events.`)
        return;
    }

    const handler = handlers[topic];

    if (!handler) {
        const message = `❌ Cannot find handler for this topic: ${topic}`;
        Logger.error(message);

        return;
    }

    await handler(core, kafkaMessage);
}