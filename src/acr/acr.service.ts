import { Injectable } from '@nestjs/common';
import { Account } from 'src/db/entities/account.entity';
import { MEMBER_STATUS } from 'src/db/entities/account-workspace-relationship.entity';
import { EntityManager } from 'typeorm';
import dateUtils from 'src/helpers/dateUtils';
import { AccountClusterRelationship } from 'src/db/entities/account-cluster-relationship.entity';
import { Cluster } from 'src/db/entities/cluster.entity';

/**
 * ACR - Account-Cluster-Relationship
 */

@Injectable()
export class AcrService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    public async createAcr(account: Account, cluster: Cluster, memberStatus?: MEMBER_STATUS, manager: EntityManager = this.entityManager): Promise<void> {
        const acr: Partial<AccountClusterRelationship> = {
            account,
            cluster,
            status: memberStatus,
            createdAt: dateUtils.toUnix(),
            updatedAt: dateUtils.toUnix()
        }
        await manager.getRepository(AccountClusterRelationship).save(acr);
    }
}
