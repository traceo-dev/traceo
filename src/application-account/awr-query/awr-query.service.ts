import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountApplicationRelationship } from 'src/db/entities/account-application-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { EntityManager } from 'typeorm';
import { ApplicationDtoQuery } from '../awr.model';

@Injectable()
export class AwrQueryService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    /**
     * Return single object with account data and status field from AccountApplicationRelationship
     * 
     * @param accountId 
     * @param appId 
     * @returns 
     */
    public async getAccount(accountId: string, appId?: string): Promise<Account | AccountApplicationRelationship | null> {

        if (!appId) {
            return await this.entityManager.getRepository(Account)
                .createQueryBuilder('account')
                .where('account.id = :id', { id: accountId })
                .leftJoin('account.github', 'github')
                .addSelect(["github.name", "github.avatar", "github.profileUrl", "github.createdAt", "github.login"])
                .getOne();
        }

        const response = await this.entityManager.getRepository(AccountApplicationRelationship)
            .createQueryBuilder("accountApplicationRelationship")
            .where('accountApplicationRelationship.application = :appId', { appId })
            .innerJoin("accountApplicationRelationship.account", "account", "account.id = :accountId", { accountId })
            .leftJoin('account.github', 'github')
            .addSelect(["account.name", "account.email", "account.id", "account.logo", "account.role", "account.active"])
            .addSelect(["accountApplicationRelationship.status"])
            .addSelect(["github.name", "github.avatar", "github.profileUrl", "github.createdAt", "github.login"])
            .getOne();

        const res = {
            status: response?.status,
            ...response?.account
        };

        return res as unknown as AccountApplicationRelationship;
    }

    /**
     * Return pageable list of the members assigned to app
     * 
     * @param appId 
     * @param pageOptionsDto 
     * @returns 
     */
    public async getApplicationMembers(appId: number, pageOptionsDto: BaseDtoQuery): Promise<AccountApplicationRelationship[]> {
        const { order, take, search, page } = pageOptionsDto;
        let queryBuilder = await this.entityManager
            .getRepository(AccountApplicationRelationship)
            .createQueryBuilder("accountApplicationRelationship")
            .innerJoin("accountApplicationRelationship.application", "app", "app.id = :appId", {
                appId
            })
            .leftJoin("accountApplicationRelationship.account", "account");

        if (search) {
            queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", { name: `%${search}%` })
        }

        queryBuilder
            .addSelect(["account.name", "account.email", "account.id", "account.logo"])
            .orderBy("accountApplicationRelationship.createdAt", order)
            .skip((page - 1) * take)
            .take(take);

        return await queryBuilder.getMany();
    }

    /**
     * Return pageable list of the Apps assigned to account
     * 
     * @param accountId 
     * @param pageOptionsDto 
     * @returns 
     */

    public async getApplicationsForAccount(accountId: string, pageOptionsDto: ApplicationDtoQuery): Promise<AccountApplicationRelationship[]> {
        const { page, take, order, search, sortBy, favorite } = pageOptionsDto;
        try {
            const queryBuilder = this.entityManager
                .getRepository(AccountApplicationRelationship)
                .createQueryBuilder("accountApplicationRelationship")
                .innerJoin("accountApplicationRelationship.account", "account", "account.id = :accountId", {
                    accountId,
                })
                .leftJoinAndSelect("accountApplicationRelationship.application", "application")
                .loadRelationCountAndMap("application.incidentsCount", "application.incidents")
                .leftJoin("application.owner", "owner")
                // .orderBy("accountApplicationRelationship.favorite", "DESC")

            if (search) {
                queryBuilder.where("LOWER(application.name) LIKE LOWER(:name)", { name: `%${search}%` })
                    .orWhere("LOWER(application.technology) LIKE LOWER(:name)", { name: `%${search}%` })
                    .orWhere("LOWER(application.framework) LIKE LOWER(:name)", { name: `%${search}%` })
                    .orWhere("LOWER(owner.name) LIKE LOWER(:name)", { name: `%${search}%` })
            }

            queryBuilder.orderBy(sortBy, order)

            if (favorite) {
                queryBuilder.andWhere("accountApplicationRelationship.favorite = :favorite", { favorite })
            }

            return await queryBuilder
                .addSelect(["owner.name", "owner.email", "owner.id"])
                .skip((page - 1) * take)
                .take(take)
                .getMany();

        } catch (error) {
            console.log("ER: ", error)
            throw error;
        }
    }

    public async awrExists({ accountId, appId }: { accountId: string, appId: number }, manager: EntityManager = this.entityManager): Promise<boolean> {
        const count = await manager.getRepository(AccountApplicationRelationship)
            .createQueryBuilder("accountApplicationRelationship")
            .where(
                'accountApplicationRelationship.account = :accountId AND accountApplicationRelationship.application = :appId',
                {
                    accountId,
                    appId,
                },
            ).getCount();
        return count > 0;
    }
}
