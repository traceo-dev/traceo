import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.model';
import { AmrService } from 'src/application-member/amr.service';
import { Account } from 'src/db/entities/account.entity';
import { Application } from 'src/db/entities/application.entity';
import { MemberRole } from 'src/db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { ApplicationWithNameAlreadyExistsError } from 'src/helpers/errors';
import { CreateApplicationBody, ApplicationBody } from './application.model';
import dateUtils from 'src/helpers/dateUtils';
import { ApplicationQueryService } from './application-query/application-query.service';

@Injectable()
export class ApplicationService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrService: AmrService,
        private readonly applicationQueryService: ApplicationQueryService
    ) { }

    public async createApplication(data: CreateApplicationBody, user: RequestUser): Promise<Application> {
        const { id } = user;

        const privateKey = crypto.randomUUID();
        try {
            return await this.entityManager.transaction(async (manager) => {

                await this.validate(data.name, manager);

                const account = await manager.getRepository(Account).findOneBy({ id });
                if (!account) {
                    throw new NotFoundException();
                }

                const applicationPayload: Application = {
                    ...data,
                    privateKey,
                    owner: account,
                    createdAt: dateUtils.toUnix(),
                    updatedAt: dateUtils.toUnix()
                }

                const application = await manager.getRepository(Application).save(applicationPayload);
                await this.attachDsn(application, user, manager);

                await this.awrService.createAwr(
                    account,
                    application,
                    MemberRole.ADMINISTRATOR,
                    manager
                );

                return application;
            })
        } catch (error) {
            Logger.error(`[${this.createApplication.name}] Caused by: ${error}`);
            throw new Error(error);
        }
    }

    private async attachDsn(application: Application, user: RequestUser, manager: EntityManager = this.entityManager): Promise<void> {
        const { id, privateKey } = application;
        const workerUrl = process.env.TRACEO_WORKER_HOST;

        //TODO: support for https
        const dsn = `http://${privateKey}:${workerUrl}/${id}`;

        await this.updateApplication({ id, dsn }, user, manager);
    }

    public async updateApplication(appBody: ApplicationBody | Partial<Application>, account: RequestUser, manager: EntityManager = this.entityManager): Promise<any> {
        const { id, ...rest } = appBody;
        const { name } = rest;

        try {
            if (name) {
                await this.validate(name);
            }

            await manager.getRepository(Application).update({ id }, {
                updatedAt: dateUtils.toUnix(),
                ...rest
            });
        } catch (error) {
            Logger.error(`[${this.updateApplication.name}] Caused by: ${error}`);
            throw new Error(error);
        }
    }

    private async validate(name: string, manager: EntityManager = this.entityManager): Promise<void> {
        const application = await this.applicationQueryService.getApplicationByName(name);
        if (application) {
            throw new ApplicationWithNameAlreadyExistsError();
        }
    }

    public async deleteApplication(appId: string, user: RequestUser): Promise<void> {

        //check here permission, create util for this

        await this.entityManager.getRepository(Application)
            .createQueryBuilder('application')
            .where('application.id = :appId', { appId })
            .delete()
            .execute();
    }
}
