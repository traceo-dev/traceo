import { Injectable } from "@nestjs/common";
import { TraceoLog } from "@traceo/types";
import { BaseWorkerService } from "../../../common/base/worker/base-worker.service";
import { Application } from "../../../db/entities/application.entity";
import { Log } from "../../../db/entities/log.entity";
import { EntityManager } from "typeorm";
import { LiveService } from "src/common/services/live.service";

@Injectable()
export class WorkerLogsService extends BaseWorkerService<TraceoLog[]> {
  constructor(
    readonly entityManager: EntityManager,
    readonly live: LiveService
  ) {
    super(entityManager);
  }

  public async handle(application: Application, data: TraceoLog[]): Promise<void> {
    const { id } = application;
    const logs = data.map(({ timestamp, level, message, resources, unix }) => ({
      application: {
        id
      },
      timestamp,
      level,
      message,
      receiveTimestamp: unix,
      resources: {
        appId: id,
        ...resources
      }
    }));
    await this.entityManager.getRepository(Log).save(logs);
    this.logger.log(`New logs saved for application: ${application.id}.`);

    this.live.publish(id, {
      action: "log",
      message: logs.sort((a, b) => b.receiveTimestamp - a.receiveTimestamp)
    });
  }
}
