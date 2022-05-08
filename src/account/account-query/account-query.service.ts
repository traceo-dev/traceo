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

    public async getAccountByEmail(email: string): Promise<Account | null> {
        return this.repository.findOneBy({ email })
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
