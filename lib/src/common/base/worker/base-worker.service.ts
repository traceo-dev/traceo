import { Injectable, Logger } from "@nestjs/common";
import { Application } from "../../../db/entities/application.entity";
import { EntityManager } from "typeorm";
import Queue from "promise-queue";
import { isEmpty } from "../../helpers/base";
import { Dictionary } from "@traceo/types";

@Injectable()
export abstract class BaseWorkerService<PAYLOAD> {
  public readonly logger: Logger;
  private readonly promises: Queue;
  private manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
    this.promises = new Queue(1);
    this.logger = new Logger(BaseWorkerService.name);
  }

  public abstract handle(application: Application, data: PAYLOAD): Promise<void>;

  public async processWorkerData(appId: string, data: PAYLOAD, headers: Dictionary<string>) {
    const app = await this.validate(appId, data, headers);

    if (!app.isIntegrated) {
      await this.manager.getRepository(Application).save({ ...app, isIntegrated: true });
    }

    this.promises.add(() => this.handle(app, data));
  }

  private async validate(id: string, data: PAYLOAD, headers: Dictionary<string>) {
    if (process.env.DEMO === "true") {
      throw new Error("Demo version. Cannot proces this worker event.");
    }

    if (!id) {
      throw new Error("Missing property: appID.");
    }

    const app: Application = await this.manager.getRepository(Application).findOneBy({ id });
    if (!app) {
      throw new Error(`Application with id: ${id} does not exists!`);
    }

    const apiKey = headers["x-sdk-key"] || null;
    if (!apiKey) {
      throw new Error("Missing property: API Key.");
    }

    const sdkName = headers["x-sdk-name"];
    if (!sdkName) {
      throw new Error("Missing property: SDK Name.")
    }

    if (!app.security?.apiKey || app.security?.apiKey !== apiKey) {
      throw new Error(`Bad API Key for App ID: ${id}`);
    }

    if (!data || isEmpty(data as unknown as object)) {
      throw new Error("Cannot process without data!");
    }

    return app;
  }
}
