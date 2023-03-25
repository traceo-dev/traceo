import { ClickHouseClient } from "@clickhouse/client";
import { SDK } from "@traceo/types";
import { Kafka, Producer } from "kafkajs";
import { DatabaseService } from "./db/database";

export interface Core {
    kafka: Kafka;
    kafkaProducer: Producer;
    db: DatabaseService;
    clickhouse: ClickHouseClient;
};

export type RelayEventType<T> = {
    appId: string;
    sdk: string | SDK;
    payload: T
};