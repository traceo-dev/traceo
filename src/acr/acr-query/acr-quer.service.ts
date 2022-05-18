import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "src/core/generic.model";
import { AccountClusterRelationship } from "src/db/entities/account-cluster-relationship.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class AcrQueryService {
    constructor (
        readonly entityManager: EntityManager
    ) {}

    public async getClustersForAccount(accountId: string, pageOptionsDto: BaseDtoQuery): Promise<AccountClusterRelationship[]> {
        const { search } = pageOptionsDto;

        try {
            const queryBuilder = await this.entityManager
                .getRepository(AccountClusterRelationship)
                .createQueryBuilder("accountClusterRelationship")
                .innerJoin("accountClusterRelationship.account", "account", "account.id = :accountId", {
                    accountId,
                })
                .leftJoinAndSelect("accountClusterRelationship.cluster", "cluster")
                .leftJoin("cluster.owner", "owner")
                .orderBy("accountClusterRelationship.createdAt", "DESC")

            if (search) {
                queryBuilder.where("LOWER(cluster.name) LIKE LOWER(:name)", { name: `%${search}%` })
            }

            return queryBuilder
                .addSelect(["owner.name", "owner.email", "owner.id"])
                .getMany();

        } catch (error) {
            throw error;
        }
    }
}