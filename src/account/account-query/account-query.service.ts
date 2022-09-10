import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { GenericQueryService } from 'src/core/generic-query.service';
import { Account } from 'src/db/entities/account.entity';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class AccountQueryService extends GenericQueryService<Account, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Account);
    }

    public async getAccounts(pageOptionsDto: BaseDtoQuery): Promise<Account[]> {
        const { order, take, search, page } = pageOptionsDto;
        let queryBuilder = this.entityManager
            .getRepository(Account)
            .createQueryBuilder("account");

        if (search) {
            queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", { name: `%${search}%` })
            queryBuilder.where("LOWER(account.username) LIKE LOWER(:username)", { username: `%${search}%` })
        }

        queryBuilder
            .orderBy("account.updatedAt", order)
            .skip((page - 1) * take)
            .take(take);

        return await queryBuilder.getMany();
    }

    public async getAccountByEmail(email: string): Promise<Account | null> {
        return this.repository.findOneBy({ email })
    }

    public async getAccountByUsername(username: string): Promise<Account | null> {
        return this.repository.findOneBy({ username })
    }

    public getBuilderAlias(): string {
        return 'account';
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Account>, query: BaseDtoQuery): SelectQueryBuilder<Account> {
        throw new Error('Method not implemented.');
    }

    public selectedColumns(): string[] {
        throw new Error('Method not implemented.');
    }
}
