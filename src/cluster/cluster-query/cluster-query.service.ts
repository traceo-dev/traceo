import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "src/core/generic.model";
import { AccountClusterRelationship } from "src/db/entities/account-cluster-relationship.entity";
import { Workspace } from "src/db/entities/workspace.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class ClusterQueryService {
    constructor(
        private readonly entityManager: EntityManager
    ) { }

    public async getWorkspacesForCluster(clusterId: string): Promise<Workspace[]> {
        try {
            return await this.entityManager
                .getRepository(Workspace)
                .createQueryBuilder("workspace")
                .where("workspace.cluster = :clusterId", { clusterId })
                .orderBy("workspace.lastIncidentAt", "DESC")
                .getMany();

        } catch (error) {
            throw error;
        }
    }

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