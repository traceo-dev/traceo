import { Injectable } from '@nestjs/common';
import { AccountMemberRelationship } from '../../../lib/db/entities/account-member-relationship.entity';
import { Account } from '../../../lib/db/entities/account.entity';
import { UnauthorizedError } from '../../../lib/helpers/errors';
import { RequestUser } from '../../../lib/types/interfaces/account.interface';
import { EntityManager } from 'typeorm';
import { MemberRole } from '../../../lib/types/enums/amr.enum';

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
    "UPDATE_ACCOUNT_IN_APP" |
    "GENERATE_API_KEY" |
    "REMOVE_API_KEY";

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

    private async checkRole(performer: Performer, appId: string) {
        const amr = await this.entityManager
            .getRepository(AccountMemberRelationship)
            .findOneBy({
                account: { id: performer.id },
                application: {
                    id: appId
                }
            });

        if (!amr.role) {
            throw new Error(`No Role attached to this performer!. Performer: ${performer}`);
        }

        return {
            admin: amr.role === MemberRole.ADMINISTRATOR,
            maintainer: amr.role === MemberRole.MAINTAINER
        };
    }

    public async can(action: Action, performer: Performer, appId?: string) {
        const isSystemAdmin = await this.checkIsSystemAdmin(performer);
        if (isSystemAdmin) {
            return true;
        }

        // Only system admin's
        if (['CREATE_APP', 'DELETE_APP', 'CREATE_APP', 'CREATE_ACCOUNT', 'DELETE_ACCOUNT'].includes(action)) {
            const can = await this.checkIsSystemAdmin(performer);
            if (!can) {
                throw new UnauthorizedError('You cannot perform this operation.')
            }
        }

        // Only app admin's
        if (['GENERATE_API_KEY', 'REMOVE_API_KEY'].includes(action)) {
            const { admin } = await this.checkRole(performer, appId);
            if (!admin) {
                throw new UnauthorizedError('You cannot perform this operation.')
            }
        }

        // Only app admin's and maintainer's
        if (['DELETE_INCIDENT', 'UPDATE_DATASOURCE', 'ADD_ACCOUNT_TO_APP', 'REMOVE_ACCOUNT_FROM_APP', 'UPDATE_ACCOUNT_IN_APP', 'REMOVE_DATASOURCE'].includes(action)) {
            const isSystemAdmin = await this.checkIsSystemAdmin(performer);
            const { admin, maintainer } = await this.checkRole(performer, appId);

            const can = isSystemAdmin || admin || maintainer;
            if (!can) {
                throw new UnauthorizedError('You cannot perform this operation.')
            }
        }
    }
}
