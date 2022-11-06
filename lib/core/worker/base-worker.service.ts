import { Injectable, Logger } from "@nestjs/common";
import { Application } from "../../../lib/db/entities/application.entity";
import { isEmpty } from "../../../lib/helpers/base";
import { EntityManager } from "typeorm";
import Queue from "promise-queue";

@Injectable()
export abstract class BaseWorkerService<PAYLOAD> {
    public readonly logger: Logger;
    private readonly promises: Queue;
    private manager: EntityManager;

    constructor(
        manager: EntityManager
    ) {
        this.manager = manager;
        this.promises = new Queue(1);
        this.logger = new Logger(BaseWorkerService.name)
    }

    public abstract handle(application: Application, data: PAYLOAD): Promise<void>;

    public async processWorkerData(appId: number, data: PAYLOAD) {
        if (!appId) {
            this.logger.error(`appID is required!`)
            return;
        }

        if (!data || isEmpty(data as unknown as object)) {
            this.logger.error(`Cannot process without data!`)
            return;
        }

        const app: Application = await this.manager.getRepository(Application).findOneBy({ id: appId });
        if (!app) {
            this.logger.error(`Application with id: ${appId} does not exists!`)
            return;
        }

        this.promises.add(() => this.handle(app, data));
    }
}