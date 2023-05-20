import { relayWorkerConfigs } from "./config";
import { startRelayWorker } from "./worker";
import { TraceoClient } from "@traceo-sdk/node";
import { config } from "dotenv";

config();

const configs = relayWorkerConfigs();

export const traceo = new TraceoClient(configs.TRACEO_API_KEY, {
    host: configs.TRACEO_HOST,
    exportIntervalMillis: 10000,
    collectMetrics: true
});

export const logger = traceo.logger;
void startRelayWorker(configs);