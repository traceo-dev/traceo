import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.model';
import { AwrService } from 'src/awr/awr.service';
import { Account } from 'src/db/entities/account.entity';
import { Workspace } from 'src/db/entities/workspace.entity';
import { MEMBER_STATUS } from 'src/db/entities/account-workspace-relationship.entity';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { WorkspaceWithNameAlreadyExistsError } from 'src/helpers/errors';
import { CreateWorkspaceModel, WorkspaceModel } from './workspace.model';
import dateUtils from 'src/helpers/dateUtils';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { WorkspaceQueryService } from './workspace-query/workspace-query.service';
import { getKeyFromBucketUrl } from 'src/helpers/base';
import { AttachmentType } from 'src/db/entities/attachment.entity';

@Injectable()
export class WorkspaceService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrService: AwrService,
        private readonly awsBucketService: AWSBucketService,
        private readonly workspaceQueryService: WorkspaceQueryService
    ) { }

    public async createWorkspace(data: CreateWorkspaceModel, account: RequestUser): Promise<Workspace> {
        const { id } = account;

        const privateKey = crypto.randomUUID();
        return await this.entityManager.transaction(async (manager) => {

            await this.validate(data.name, manager);

            const account = await manager.getRepository(Account).findOneBy({ id });
            if (!account) {
                throw new NotFoundException();
            }

            const workspace = await manager.getRepository(Workspace).save({
                ...data,
                privateKey,
                owner: account,
                createdAt: dateUtils.toUnix(),
                updatedAt: dateUtils.toUnix()
            });

            await this.awrService.createAwr(
                {
                    account,
                    workspace,
                    memberStatus: MEMBER_STATUS.OWNER,
                },
                manager
            );

            //create statistics

            return workspace;
        })
    }

    public async updateWorkspace(workspaceModel: WorkspaceModel, account: RequestUser, manager: EntityManager = this.entityManager): Promise<any> {
        const { id, ...rest } = workspaceModel;
        const { logo, name } = rest;
        const workspace = await this.workspaceQueryService.getDto(id);

        //check here for privilleges

        if (logo && workspace?.logo) {
            const keyName = `${AttachmentType.WORKSPACE_AVATAR}/${getKeyFromBucketUrl(workspace?.logo)}`;
            await this.awsBucketService.removeFileFromBucket(keyName);
        }

        if (name) {
            await this.validate(name);
        }

        await manager.getRepository(Workspace).update({ id }, {
            updatedAt: dateUtils.toUnix(),
            ...rest
        });
    }

    private async validate(name: string, manager: EntityManager = this.entityManager): Promise<void> {
        const workspace = await this.workspaceQueryService.getWorkspaceByName(name);
        if (workspace) {
            throw new WorkspaceWithNameAlreadyExistsError();
        }
    }
}
