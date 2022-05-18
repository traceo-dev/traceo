import { Injectable } from "@nestjs/common";
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

}