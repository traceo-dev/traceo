import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.model';
import { AwrService } from 'src/application-account/awr.service';
import { Account } from 'src/db/entities/account.entity';
import { Application } from 'src/db/entities/application.entity';
import { MEMBER_STATUS } from 'src/db/entities/account-application-relationship.entity';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { ApplicationWithNameAlreadyExistsError } from 'src/helpers/errors';
import { CreateApplicationBody, ApplicationBody } from './application.model';
import dateUtils from 'src/helpers/dateUtils';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { ApplicationQueryService } from './application-query/application-query.service';
import { getKeyFromBucketUrl } from 'src/helpers/base';
import { AttachmentType } from 'src/db/entities/attachment.entity';

@Injectable()
export class ApplicationService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrService: AwrService,
        private readonly awsBucketService: AWSBucketService,
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
                    MEMBER_STATUS.OWNER,
                    manager
                );

                return application;
            })
        } catch (error) {
            console.log(error)
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
        const { logo, name } = rest;
        const application = await this.applicationQueryService.getDto(id);

        //check here for privilleges

        if (logo && application?.logo) {
            const keyName = `${AttachmentType.APPLICATION_AVATAR}/${getKeyFromBucketUrl(application?.logo)}`;
            await this.awsBucketService.removeFileFromBucket(keyName);
        }

        if (name) {
            await this.validate(name);
        }

        await manager.getRepository(Application).update({ id }, {
            updatedAt: dateUtils.toUnix(),
            ...rest
        });
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
