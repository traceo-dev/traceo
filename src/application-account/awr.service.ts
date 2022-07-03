import { Injectable } from '@nestjs/common';
import { Account } from 'src/db/entities/account.entity';
import { MEMBER_STATUS, AccountApplicationRelationship } from 'src/db/entities/account-application-relationship.entity';
import { EntityManager } from 'typeorm';
import { AwrQueryService } from './awr-query/awr-query.service';
import { AccountAlreadyInApplicationError } from 'src/helpers/errors';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { AwrModel } from './awr.model';
import dateUtils from 'src/helpers/dateUtils';
import { Application } from 'src/db/entities/application.entity';

/**
 * AWR - Account-Application-Relationship
 */

@Injectable()
export class AwrService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrQueryService: AwrQueryService,
        private readonly accountQueryService: AccountQueryService,
        private readonly applicationQueryService: ApplicationQueryService,
        private readonly mailingService: MailingService
    ) { }

    public async createAwr(account: Account, application: Application, memberStatus: MEMBER_STATUS = MEMBER_STATUS.DEVELOPER, manager: EntityManager = this.entityManager): Promise<void> {
        const awr: Partial<AccountApplicationRelationship> = {
            account,
            application,
            status: memberStatus,
            createdAt: dateUtils.toUnix(),
            updatedAt: dateUtils.toUnix()
        }
        await manager.getRepository(AccountApplicationRelationship).save(awr);
    }

    public async addAccountToApplication(email: string, appId: number): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            /**
             * Send Email when account not exists
             */
            const account = await this.accountQueryService.getAccountByEmail(email);
            if (!account) {
                const url = `${process.env.APP_ORIGIN}/signUp?w=${appId}`;
                await this.mailingService.sendInviteToMemberWithoutAccount({
                    email,
                    url,
                    appId
                });

                return;
            }

            const exists = await this.awrQueryService.awrExists({ accountId: account?.id, appId }, manager);
            if (exists) {
                throw new AccountAlreadyInApplicationError();
            }

            const url = `${process.env.APP_ORIGIN}/invite?w=${appId}&ac=${account.id}`;
            await this.mailingService.sendInviteToMember({
                email,
                url,
                accountName: account.name,
                appId
            });

            return;
        });
    }

    public async assignAccountToApplication(accountId: string, appId: number): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            const exists = await this.awrQueryService.awrExists({ accountId, appId }, manager);
            if (exists) {
                throw new AccountAlreadyInApplicationError();
            }

            const account = await this.accountQueryService.getDto(accountId);
            const application = await this.applicationQueryService.getDto(appId);

            await this.createAwr(
                account,
                application
            );
        });
    }

    public async updateApplicationAccount(awrModel: AwrModel, manager: EntityManager = this.entityManager): Promise<void> {
        const { id, ...rest } = awrModel;
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountApplicationRelationship).update({ id }, rest);
        });
    }

    public async removeAccountFromApplication(awrId: string): Promise<void> {
        return this.removeAwr(awrId);
    }

    private async removeAwr(awrId: string, manager: EntityManager = this.entityManager): Promise<void> {
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountApplicationRelationship).delete({ id: awrId });
        });
    }

    public async leaveApplication(aid: string, appId: number): Promise<void> {
        const awr = await this.entityManager.getRepository(AccountApplicationRelationship).findOneBy({
            account: {
                id: aid
            },
            application: {
                id: appId
            }
        });

        if (!awr) {
            throw new Error("Relationship does not exists!");
        }

        await this.removeAccountFromApplication(awr.id);
    }
}
