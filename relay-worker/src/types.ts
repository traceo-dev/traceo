import { SDK } from "@traceo/types";
import { Kafka, Producer } from "kafkajs";
import { DatabaseService } from "./database";


export interface Core {
    kafka: Kafka;
    kafkaProducer: Producer;
    db: DatabaseService;
};

export type RelayEventType<T> = {
    appId: string;
    sdk: string | SDK;
    payload: T
};