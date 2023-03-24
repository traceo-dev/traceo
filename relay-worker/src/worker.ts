import { RelayWorkerConfig } from "./config";
import { Core, initWorker } from "./core";
import { ExceptionHandlers } from "@traceo-sdk/node";
import { startEventConsumer } from "./kafka";
import { logger } from ".";

export const startRelayWorker = async (configs: RelayWorkerConfig) => {
    let core: Core = undefined;

    process.on('beforeExit', () => {
        process.exit(0);
    });

    try {
        const workerInstance = await initWorker(configs);
        core = workerInstance.core;

        await startEventConsumer({ configs, core });

        logger.log('✔ Traceo worker is running.')
    } catch (error) {
        logger.error(error);
        ExceptionHandlers.catchException(error);
        
        process.exit(1);
    }
}
