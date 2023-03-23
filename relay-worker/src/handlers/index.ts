import { KafkaMessage } from "kafkajs";
import { KAFKA_TOPIC } from "@traceo/types";
import { handleIncidentEvent } from "./incident-event-handler";

export const eventHandler: Record<KAFKA_TOPIC, (message: KafkaMessage) => void> = {
    [KAFKA_TOPIC.INCIDENT_EVENT]: async (message) => await handleIncidentEvent(message),
    [KAFKA_TOPIC.LOGS_EVENT]: (m) => console.log(m),
}