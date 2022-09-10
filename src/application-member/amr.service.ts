import { Injectable } from '@nestjs/common';
import { Account } from 'src/db/entities/account.entity';
import { MemberRole, AccountMemberRelationship } from 'src/db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AccountAlreadyInApplicationError } from 'src/helpers/errors';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { MailingService } from 'src/mailing/mailing.service';
import { AddAccountToApplicationModel, UpdateAmrModel } from './amr.model';
import dateUtils from 'src/helpers/dateUtils';
import { Application } from 'src/db/entities/application.entity';
import { Incident } from 'src/db/entities/incident.entity';

/**
 * AMR - Application-Member-Relationship
 */

@Injectable()
export class AmrService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly awrQueryService: AmrQueryService,
        private readonly accountQueryService: AccountQueryService,
        private readonly applicationQueryService: ApplicationQueryService
    ) { }

    public async createAwr(account: Account, application: Application, role: MemberRole = MemberRole.VIEWER, manager: EntityManager = this.entityManager): Promise<void> {
        const awr: Partial<AccountMemberRelationship> = {
            account,
            application,
            role,
            createdAt: dateUtils.toUnix(),
            updatedAt: dateUtils.toUnix()
        }
        await manager.getRepository(AccountMemberRelationship).save(awr);
    }

    public async addAccountToApplication(body: AddAccountToApplicationModel): Promise<void> {
        const { applicationId, accountId, role } = body;
        await this.entityManager.transaction(async (manager) => {
            const exists = await this.awrQueryService.awrExists({ accountId, applicationId }, manager);
            if (exists) {
                throw new AccountAlreadyInApplicationError();
            }

            const account = await this.accountQueryService.getDto(accountId);
            const application = await this.applicationQueryService.getDto(applicationId);

            await this.createAwr(
                account,
                application,
                role
            );
        });
    }

    public async updateApplicationAccount(awrModel: UpdateAmrModel, manager: EntityManager = this.entityManager): Promise<void> {
        const { memberId, ...rest } = awrModel;
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountMemberRelationship).update({ id: memberId }, rest);
        });
    }

    public async removeAccountFromApplication(awrId: string): Promise<void> {
        return this.removeAwr(awrId);
    }

    private async removeAwr(awrId: string, manager: EntityManager = this.entityManager): Promise<void> {
        await manager.transaction(async (manager) => {
            manager.getRepository(AccountMemberRelationship).delete({ id: awrId });
        });
    }

    public async leaveApplication(aid: string, appId: number): Promise<void> {
        await this.entityManager.transaction(async (manager) => {
            const assignedIncidents = await manager.getRepository(Incident).find({
                where: {
                    assigned: {
                        id: aid
                    }
                }
            });

            const promises = assignedIncidents?.map(async (incident) => {
                await this.entityManager.getRepository(Incident).update({ id: incident.id }, { assigned: null })
            });
            await Promise.all(promises);

            const awr = await this.entityManager.getRepository(AccountMemberRelationship).findOneBy({
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
        });
    }
}
