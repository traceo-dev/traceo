import { RelayWorkerConfig } from "./config";
import { initWorker } from "./core";

export const startRelayWorker = async (configs: RelayWorkerConfig) => {
    try {
        await initWorker(configs);
        console.log('✔ Traceo worker is running.')
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
