import { BaseProcessorService } from "./base-processor.service";
import { ErrorDetails, IncomingBrowserIncidentType } from "@traceo/types";
import dateUtils from "src/common/helpers/dateUtils";
import { EntityManager } from "typeorm";

export class BrowserProcessorService extends BaseProcessorService<IncomingBrowserIncidentType> {
    constructor(private _manager: EntityManager) {
        super(_manager);
    }

    public constructError(incident: IncomingBrowserIncidentType): ErrorDetails {
        const { browser, os, url } = incident?.browser;
        const error: ErrorDetails = {
            date: dateUtils.toUnix(),
            browser: { browser, os, url }
        };

        return error;
    }
}