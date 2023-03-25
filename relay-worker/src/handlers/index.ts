import { KafkaMessage } from "kafkajs";
import { KAFKA_TOPIC } from "@traceo/types";
import { handleIncidentEvent } from "./process-event-handler";
import { logger } from "..";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { handleLogsEvent } from "./process-logs-handler";
import { Core } from "../types";

type EventHandlerType = {
    core: Core,
    topic: KAFKA_TOPIC,
    message: KafkaMessage
}
export const eventHandler = async ({
    core,
    message,
    topic
}: EventHandlerType): Promise<void> => {

    const handlers: Record<KAFKA_TOPIC, (core: Core, message: KafkaMessage) => Promise<void>> = {
        [KAFKA_TOPIC.INCIDENT_EVENT]: handleIncidentEvent,
        [KAFKA_TOPIC.LOGS_EVENT]: handleLogsEvent
    };

    const handler = handlers[topic];

    if (!handler) {
        const message = `❌ Cannot find handler for this topic: ${topic}`;
        logger.error(message);

        ExceptionHandlers.catchException(new Error(message));

        return;
    }

    await handler(core, message);
}