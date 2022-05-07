import { Injectable } from "@nestjs/common";
import { PageOptionsDto } from "src/core/core.model";
import { Release } from "src/db/entities/release.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class ReleaseQueryService {
    constructor(
        private entityManager: EntityManager
    ) { }

    public async getReleases(workspaceId: string, pagination: PageOptionsDto): Promise<Release[]> {
        const { skip, order, take, search, sortBy } = pagination;
        return await this.entityManager
            .getRepository(Release)
            .createQueryBuilder("release")
            .where('release.workspaceId = :workspaceId', { workspaceId })
            .addSelect(['release.id', 'release.env', 'release.version', 'release.lastDeploymentAt', 'release.incidentsOccurCount', 'release.incidentsCount'])
            .orderBy(`release.${sortBy}`, order)
            .skip(skip)
            .take(take)
            .getMany();
    }
}