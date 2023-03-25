import { RelayWorkerConfig } from "./config";
import { initWorker } from "./core";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { logger } from ".";

export const startRelayWorker = async (configs: RelayWorkerConfig) => {
    try {
        await initWorker(configs);
        logger.log('✔ Traceo worker is running.')
    } catch (error) {
        logger.error(error);
        ExceptionHandlers.catchException(error);

        process.exit(1);
    }
}
