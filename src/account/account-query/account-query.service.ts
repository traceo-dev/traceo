import { Injectable } from '@nestjs/common';
import { CoreService } from 'src/core/core.service';
import { Account } from 'src/db/entities/account.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class AccountQueryService extends CoreService {
    constructor(
        private readonly entityManager: EntityManager
    ) {
        super();
    }

    public async getAccountById(id: string, manager: EntityManager = this.entityManager): Promise<Account | null> {
        return manager.getRepository(Account).findOneBy({ id })
    }

    public async getAccountByEmail(email: string, manager: EntityManager = this.entityManager): Promise<Account | null> {
        return manager.getRepository(Account).findOneBy({ email })
    }
}
