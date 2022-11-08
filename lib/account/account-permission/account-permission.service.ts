import { Injectable } from '@nestjs/common';
import { MemberRole } from 'app/src/types/application';
import { RequestUser } from 'lib/auth/auth.model';
import { AccountMemberRelationship } from 'lib/db/entities/account-member-relationship.entity';
import { Account } from 'lib/db/entities/account.entity';
import { Application } from 'lib/db/entities/application.entity';
import { UnauthorizedError } from 'lib/helpers/errors';
import { EntityManager } from 'typeorm';

type Action = "CREATE_APP" |
    "UPDATE_APP" |
    "DELETE_APP" |
    "CREATE_ACCOUNT" |
    "DELETE ACCOUNT" |
    "DELETE_INCIDENT" |
    "UPDATE_DATASOURCE" |
    "REMOVE_DATASOURCE" |
    "ADD_ACCOUNT_TO_APP" |
    "REMOVE_ACCOUNT_FROM_APP" |
    "UPDATE_ACCOUNT_IN_APP";

type Performer = RequestUser | Account | { id: string };

@Injectable()
export class AccountPermissionService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    private async checkIsSystemAdmin(performer: Performer): Promise<boolean> {
        const account = await this.entityManager.getRepository(Account).findOneBy({ id: performer.id });
        return account.isAdmin;
    }

    private async checkIsAppMaintainer(performer: Performer, application: Application) {
        const amr = await this.entityManager
            .getRepository(AccountMemberRelationship)
            .findOneBy({
                account: { id: performer.id },
                application: {
                    id: application.id
                }
            });

        return [MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(amr.role);
    }

    public async can(action: Action, performer: Performer, application?: Application) {
        const isSystemAdmin = await this.checkIsSystemAdmin(performer);
        if (isSystemAdmin) {
            return true;
        }

        if (['CREATE_APP', 'DELETE_APP', 'CREATE_APP', 'CREATE_ACCOUNT', 'DELETE_ACCOUNT'].includes(action)) {
            const can = await this.checkIsSystemAdmin(performer);
            if (!can) {
                throw new UnauthorizedError('You cannot perform this operation.')
            }
        }

        if (['DELETE_INCIDENT', 'UPDATE_DATASOURCE', 'ADD_ACCOUNT_TO_APP', 'REMOVE_ACCOUNT_FROM_APP', 'UPDATE_ACCOUNT_IN_APP', 'REMOVE_DATASOURCE'].includes(action)) {
            const isSystemAdmin = await this.checkIsSystemAdmin(performer);
            const isAppMaintainer = await this.checkIsAppMaintainer(performer, application);

            const can = isSystemAdmin || isAppMaintainer;
            if (!can) {
                throw new UnauthorizedError('You cannot perform this operation.')
            }
        }
    }
}
