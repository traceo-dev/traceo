import { KafkaMessage } from "kafkajs";

export const handleIncidentEvent = async (message: KafkaMessage) => {
    console.log("--- handleIncidentEvent ---");
    console.log(message.value.toString());
}