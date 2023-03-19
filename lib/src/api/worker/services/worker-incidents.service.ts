import { Injectable } from "@nestjs/common";
import { SDK, SDKIncidentPayload } from "@traceo/types";
import { BaseWorkerService } from "../../../common/base/worker/base-worker.service";
import { Application } from "../../../db/entities/application.entity";
import { EntityManager } from "typeorm";
import { IProcessor } from "./incidents-processors/processor.interface";
import { NodeProcessorService } from "./incidents-processors/node-processor.service";
import { BrowserProcessorService } from "./incidents-processors/browser-processor.service";

@Injectable()
export class WorkerIncidentsService extends BaseWorkerService<SDKIncidentPayload> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager);
  }

  private getIncidentProcessor(sdk: SDK): IProcessor<SDKIncidentPayload> {
    switch (sdk) {
      case SDK.NODE:
        return new NodeProcessorService(this.entityManager);
      case SDK.REACT:
      case SDK.VUE:
        return new BrowserProcessorService(this.entityManager);
      default:
        throw new Error(`Incident processor not found for this SDK: ${sdk}!`);
    }
  }

  public async handle(application: Application, data: SDKIncidentPayload): Promise<void> {
    try {
      const processor = this.getIncidentProcessor(data.sdk);
      await processor.process(application, data);
    } catch (error) {
      this.logger.error(
        `Cannot process incoming incident from sdk: ${data.sdk}. Caused by: ${error})`
      );

      throw new Error(error);
    }
  }
}
