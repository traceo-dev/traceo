import { relayWorkerConfigs } from "./config";
import { startRelayWorker } from "./worker";
import { TraceoClient } from "@traceo-sdk/node";
import { config } from "dotenv";

config();

const configs = relayWorkerConfigs();

export const traceo = new TraceoClient({
    apiKey: configs.TRACEO_API_KEY,
    appId: configs.TRACEO_PROJECT_ID,
    url: configs.TRACEO_HOST,
    scrapLogsInterval: 120,
    collectMetrics: false,
    scrapMetricsInterval: 15
});

export const logger = traceo.logger;
void startRelayWorker(configs);