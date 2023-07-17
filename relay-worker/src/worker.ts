import { RelayWorkerConfig } from "./config";
import { initWorker } from "./core";
import { Logger } from "./logger";

export const startRelayWorker = async (configs: RelayWorkerConfig) => {

    Logger.error("Error Lorem ipsum")
    Logger.log("Log Lorem ipsum")
    Logger.warn("Warn Lorem ipsum")

    try {
        await initWorker(configs);
        Logger.log('✔ Traceo worker is running.')
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
}
