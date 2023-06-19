import { relayWorkerConfigs } from "./config";
import { startRelayWorker } from "./worker";
import { config } from "dotenv";

config();

const configs = relayWorkerConfigs();
void startRelayWorker(configs);