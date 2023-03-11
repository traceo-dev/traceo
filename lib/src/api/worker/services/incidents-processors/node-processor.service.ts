import { Injectable } from "@nestjs/common";
import { ErrorDetails, IncomingNodeIncidentType } from "@traceo/types";
import dateUtils from "src/common/helpers/dateUtils";
import { EntityManager } from "typeorm";
import { BaseProcessorService } from "./base-processor.service";

@Injectable()
export class NodeProcessorService extends BaseProcessorService<IncomingNodeIncidentType> {
    constructor(private _manager: EntityManager) {
        super(_manager);
    }

    public constructError(_: IncomingNodeIncidentType): ErrorDetails {
        const error: ErrorDetails = {
            date: dateUtils.toUnix()
        };
        return error;
    }
}