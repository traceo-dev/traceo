import { Injectable } from '@nestjs/common';
import { PageableDto, PageOptionsDto } from 'src/core/core.model';
import { CoreService } from 'src/core/core.service';
import { AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class AwrQueryService extends CoreService {
    constructor(
        private readonly entityManager: EntityManager
    ) {
        super();
    }

    /**
     * Return single object with account data and status field from AccountWorkspaceRelationship
     * 
     * @param accountId 
     * @param workspaceId 
     * @returns 
     */
    public async getAccount(accountId: string, workspaceId?: string): Promise<Account | AccountWorkspaceRelationship | null> {
        
        if (!workspaceId) {
            return await this.entityManager.getRepository(Account).findOneBy({ id: accountId });
        }
                
        const response = await this.entityManager.getRepository(AccountWorkspaceRelationship)
            .createQueryBuilder("accountWorkspaceRelationship")
            .where(
                'accountWorkspaceRelationship.account = :accountId',
                {
                    accountId,
                },
            )
            .andWhere('accountWorkspaceRelationship.workspace = :workspaceId', { workspaceId })
            .leftJoin("accountWorkspaceRelationship.account", "account")
            .addSelect(["account.name", "account.email", "account.id", "account.logo", "account.role"])
            .addSelect(["accountWorkspaceRelationship.status"])
            .getOne();

        const res = {
            status: response?.status,
            ...response?.account
        };

        return res as unknown as AccountWorkspaceRelationship;
    }

    /**
     * Return single object from the AccountWorkspaceRelationship
     * 
     * @param id 
     * @returns 
     */
    // public async getWorkspaceMember(id: string): Promise<AccountWorkspaceRelationship | null> {
    //     return await this.entityManager
    //         .getRepository(AccountWorkspaceRelationship)
    //         .createQueryBuilder("accountWorkspaceRelationship")
    //         .where("accountWorkspaceRelationship.id = :id", { id })
    //         .leftJoin("accountWorkspaceRelationship.account", "account")
    //         .addSelect(["account.name", "account.email", "account.id", "account.logo"])
    //         .getOne();
    // }

    /**
     * Return pageable list of the members assigned to Workspace
     * 
     * @param workspaceId 
     * @param pageOptionsDto 
     * @returns 
     */
    public async getWorkspaceMembers(workspaceId: string, pageOptionsDto: PageOptionsDto): Promise<PageableDto<AccountWorkspaceRelationship>> {
        const { order, skip, take, search } = pageOptionsDto;
        let queryBuilder = await this.entityManager
            .getRepository(AccountWorkspaceRelationship)
            .createQueryBuilder("accountWorkspaceRelationship")
            .innerJoin("accountWorkspaceRelationship.workspace", "workspace", "workspace.id = :workspaceId", {
                workspaceId
            })
            .leftJoin("accountWorkspaceRelationship.account", "account");

        if (search) {
            queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", { name: `%${search}%` })
        }

        queryBuilder
            .addSelect(["account.name", "account.email", "account.id", "account.logo"])
            .orderBy("accountWorkspaceRelationship.createdAt", order)
            .skip(skip)
            .take(take);

        return this.preparePageable(queryBuilder, pageOptionsDto);
    }

    /**
     * Return pageable list of the Workspaces assigned to account
     * 
     * @param accountId 
     * @param pageOptionsDto 
     * @returns 
     */

    public async getAccountWorkspaces(accountId: string, pageOptionsDto: PageOptionsDto): Promise<PageableDto<AccountWorkspaceRelationship>> {
        const { skip, take, order } = pageOptionsDto;
        const queryBuilder = await this.entityManager
            .getRepository(AccountWorkspaceRelationship)
            .createQueryBuilder("accountWorkspaceRelationship")
            .innerJoin("accountWorkspaceRelationship.account", "account", "account.id = :accountId", {
                accountId,
            })
            .leftJoinAndSelect("accountWorkspaceRelationship.workspace", "workspace")
            .leftJoin("workspace.owner", "owner")
            .addSelect(["owner.name", "owner.email", "owner.id"])
            .orderBy("accountWorkspaceRelationship.createdAt", order)
            .skip(skip)
            .take(take);

        return this.preparePageable(queryBuilder, pageOptionsDto);
    }

    public async awrExists({ accountId, workspaceId }: { accountId: string, workspaceId: string }, manager: EntityManager = this.entityManager): Promise<boolean> {
        const count = await manager.getRepository(AccountWorkspaceRelationship)
            .createQueryBuilder("accountWorkspaceRelationship")
            .where(
                'accountWorkspaceRelationship.account = :accountId AND accountWorkspaceRelationship.workspace = :workspaceId',
                {
                    accountId,
                    workspaceId,
                },
            ).getCount();
        return count > 0;
    }
}
