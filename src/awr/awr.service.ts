import { Injectable } from '@nestjs/common';
import { Account } from 'src/db/entities/account.entity';
import { Workspace } from 'src/db/entities/workspace.entity';
import { MEMBER_STATUS, AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { EntityManager } from 'typeorm';
import { AwrQueryService } from './awr-query/awr-query.service';
import { AccountAlreadyInWorkspaceError, AccountNotExistsError, WorkspaceNotExistsError } from 'src/helpers/errors';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { AwrModel } from './awr.model';
import dateUtils from 'src/helpers/dateUtils';

/**
 * AWR - Account-Workspace-Relationship
 */

@Injectable()
export class AwrService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrQueryService: AwrQueryService,
        private readonly accountQueryService: AccountQueryService,
        private readonly workspaceQueryService: WorkspaceQueryService,
        private readonly mailingService: MailingService
    ) { }

    public async createAwr(
        { account, workspace, memberStatus = MEMBER_STATUS.DEVELOPER }:
            { account: Account, workspace: Workspace, memberStatus?: MEMBER_STATUS },
        manager: EntityManager = this.entityManager): Promise<void> {
        const awr: Partial<AccountWorkspaceRelationship> = {
            account,
            workspace,
            status: memberStatus,
            createdAt: dateUtils.toUnix(),
            updatedAt: dateUtils.toUnix()
        }
        await manager.getRepository(AccountWorkspaceRelationship).save(awr);
    }

    public async addAccountToWorkspace(email: string, workspaceId: string): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            /**
             * Send Email when account not exists
             */
            const account = await this.accountQueryService.getAccountByEmail(email, manager);
            if (!account) {
                const url = `${process.env.APP_ORIGIN}/signUp?w=${workspaceId}`;
                await this.mailingService.sendInviteToMemberWithoutAccount({
                    email,
                    url,
                    workspaceId
                });

                return;
            }

            const exists = await this.awrQueryService.awrExists({ accountId: account?.id, workspaceId }, manager);
            if (exists) {
                throw new AccountAlreadyInWorkspaceError();
            }

            const url = `${process.env.APP_ORIGIN}/invite?w=${workspaceId}&ac=${account.id}`;
            await this.mailingService.sendInviteToMember({
                email,
                url,
                accountName: account.name,
                workspaceId
            });

            return;
        });
    }

    public async assignAccountToWorkspace(accountId: string, workspaceId: string): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            const exists = await this.awrQueryService.awrExists({ accountId, workspaceId }, manager);
            if (exists) {
                throw new AccountAlreadyInWorkspaceError();
            }

            const account = await this.accountQueryService.getAccountById(accountId, manager);
            if (!account) {
                throw new AccountNotExistsError();
            }

            const workspace = await this.workspaceQueryService.getWorkspaceById(workspaceId, manager);
            if (!workspace) {
                throw new WorkspaceNotExistsError();
            }

            await this.createAwr({
                account,
                workspace
            });
        });
    }

    public async updateWorkspaceAccount(awrModel: AwrModel, manager: EntityManager = this.entityManager): Promise<void> {
        const { id, ...rest } = awrModel;
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountWorkspaceRelationship).update({ id }, rest);
        });
    }

    public async removeAccountFromWorkspace(awrId: string): Promise<void> {
        return this.removeAwr(awrId);
    }

    private async removeAwr(awrId: string, manager: EntityManager = this.entityManager): Promise<void> {
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountWorkspaceRelationship).delete({ id: awrId });
        });
    }
}
