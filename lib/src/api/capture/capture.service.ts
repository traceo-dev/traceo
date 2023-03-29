import { Injectable, Logger } from "@nestjs/common";
import { Dictionary, KAFKA_TOPIC, SDK } from "@traceo/types";
import { KafkaService } from "../../common/services/kafka/kafka.service";
import { ApiResponse } from "../../common/types/dto/response.dto";

export enum CAPTURE_ROUTE {
    INCIDENT = "incident",
    LOGS = "logs",
    METRICS = "metrics",
    RUNTIME = "runtime"
}

const mapRouteToTopic: Record<CAPTURE_ROUTE, KAFKA_TOPIC> = {
    [CAPTURE_ROUTE.INCIDENT]: KAFKA_TOPIC.INCIDENT_EVENT,
    [CAPTURE_ROUTE.LOGS]: KAFKA_TOPIC.LOGS_EVENT,
    [CAPTURE_ROUTE.METRICS]: KAFKA_TOPIC.METRICS_EVENT,
    [CAPTURE_ROUTE.RUNTIME]: KAFKA_TOPIC.RUNTIME_EVENT
}

export type CaptureType = {
    route: CAPTURE_ROUTE,
    projectId: string;
    payload: any,
    headers: Dictionary<string>,
}

type KafkaEventPayload = {
    sdk: string | SDK;
    projectId: string;
    payload: any;
}

@Injectable()
export class CaptureService {
    private readonly logger: Logger;
    constructor(
        private readonly kafka: KafkaService
    ) {
        this.logger = new Logger(CaptureService.name);
    }

    private exceptionResponse(message: string): ApiResponse<string> {
        this.logger.error(message);
        return new ApiResponse("error", message);
    }

    public async process(data: CaptureType): Promise<ApiResponse<string> | undefined | void> {
        const { projectId: project_id, headers, payload, route } = data;

        if (process.env.DEMO === "true") {
            return this.exceptionResponse('Cannot process events in demo version of the Traceo Platform.')
        }

        if (project_id === undefined) {
            return this.exceptionResponse('Project ID is not provided. You can find your ID in project settings.')
        }

        const api_key = headers["x-sdk-key"] || null;
        if (api_key === undefined || api_key === null) {
            return this.exceptionResponse('Api key is not provided. You can generate your API KEY in project settings.')
        } else {
            const isValid: boolean = this.isValidApiKey(api_key);
            if (!isValid) {
                return this.exceptionResponse('Provided Api key is invalid.')
            }
        }

        const sdk_name = headers["x-sdk-name"];
        if (!sdk_name) {
            return this.exceptionResponse('Missing SDK name property in headers. This is probably problem on the Traceo side. Please report an issue on Github.')
        } else if (!Object.values(SDK).includes(sdk_name as any)) {
            return this.exceptionResponse("Provided SDK name is invalid. Please report this issue on Github.")
        }

        const topic = mapRouteToTopic[route];

        const kafkaPayload: KafkaEventPayload = {
            sdk: sdk_name,
            projectId: project_id,
            payload
        }

        try {
            this.kafka.send(topic, [{
                value: JSON.stringify(kafkaPayload)
            }]);

            this.logger.log(`Event has been send to kafka topic: ${topic}.`);
            return new ApiResponse("success", undefined, undefined);
        } catch (error) {
            // TODO: handle in case of error
            return new ApiResponse("error", `Cannot send event to kakfa. Caused by: ${error}`)
        }
    }

    private isValidApiKey(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        return uuidRegex.test(uuid)
    }
}