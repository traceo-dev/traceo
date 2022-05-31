import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class AwrQueryService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    /**
     * Return single object with account data and status field from AccountWorkspaceRelationship
     * 
     * @param accountId 
     * @param workspaceId 
     * @returns 
     */
    public async getAccount(accountId: string, workspaceId?: string): Promise<Account | AccountWorkspaceRelationship | null> {

        if (!workspaceId) {
            return await this.entityManager.getRepository(Account)
                .createQueryBuilder('account')
                .where('account.id = :id', { id: accountId })
                .leftJoin('account.github', 'github')
                .addSelect(["github.name", "github.avatar", "github.profileUrl", "github.createdAt", "github.login"])
                .getOne();
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
            .leftJoin('account.github', 'github')
            .addSelect(["github.name", "github.avatar", "github.profileUrl", "github.createdAt", "github.login"])
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
    public async getWorkspaceMembers(workspaceId: string, pageOptionsDto: BaseDtoQuery): Promise<AccountWorkspaceRelationship[]> {
        const { order, take, search, page } = pageOptionsDto;
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
            .addSelect(["account.n", "account.email", "account.id", "account.logo"])
            .orderBy("accountWorkspaceRelationship.createdAt", order)
            .skip((page - 1) * take)
            .take(take);

        return await queryBuilder.getMany();
    }

    /**
     * Return pageable list of the Workspaces assigned to account
     * 
     * @param accountId 
     * @param pageOptionsDto 
     * @returns 
     */

    public async getWorkspacesForAccount(accountId: string, pageOptionsDto: BaseDtoQuery): Promise<AccountWorkspaceRelationship[]> {
        const { page, take, order, search, sortBy } = pageOptionsDto;
        try {
            const queryBuilder = await this.entityManager
                .getRepository(AccountWorkspaceRelationship)
                .createQueryBuilder("accountWorkspaceRelationship")
                .innerJoin("accountWorkspaceRelationship.account", "account", "account.id = :accountId", {
                    accountId,
                })
                .leftJoinAndSelect("accountWorkspaceRelationship.workspace", "workspace")
                .leftJoin("workspace.owner", "owner")
                .leftJoin("workspace.cluster", "cluster")
                .orderBy("accountWorkspaceRelationship.favorite", "DESC")

            if (search) {
                queryBuilder.where("LOWER(workspace.name) LIKE LOWER(:name)", { name: `%${search}%` })
                queryBuilder.orWhere("LOWER(workspace.technology) LIKE LOWER(:name)", { name: `%${search}%` })
                queryBuilder.orWhere("LOWER(workspace.framework) LIKE LOWER(:name)", { name: `%${search}%` })
                queryBuilder.orWhere("LOWER(cluster.name) LIKE LOWER(:name)", { name: `%${search}%` })
                queryBuilder.orWhere("LOWER(owner.name) LIKE LOWER(:name)", { name: `%${search}%` })
            }

            if (sortBy){
                queryBuilder.addOrderBy(sortBy, order)
            }

            return queryBuilder
                .addSelect(["owner.name", "owner.email", "owner.id"])
                .addSelect(["cluster.name", "cluster.id"])
                .skip((page - 1) * take)
                .take(take)
                .getMany();

        } catch (error) {
            throw error;
        }
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
