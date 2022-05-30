import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "src/core/generic.model";
import { GenericQueryService } from "src/core/generic-query.service";
import { Release } from "src/db/entities/release.entity";
import { EntityManager, SelectQueryBuilder } from "typeorm";
import { Incident } from "src/db/entities/incident.entity";

@Injectable()
export class ReleaseQueryService extends GenericQueryService<Release, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Release)
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Release>, query: BaseDtoQuery): SelectQueryBuilder<Release> {
        const { workspaceId } = query;

        return builder.where('release.workspaceId = :workspaceId', { workspaceId });
    }

    public getBuilderAlias(): string {
        return 'release';
    }

    public selectedColumns(): string[] {
        return ['id', 'env', 'version', 'lastDeploymentAt', 'incidentsOccurCount', 'incidentsCount'];
    }

    public async getResolvedIncidentsInRelease(id: string): Promise<Incident[]> {
        return await this.entityManager.getRepository(Incident).find({
            where: {
                resolved: {
                    id
                }
            },
            relations: ['assigned']
        })
    }
}