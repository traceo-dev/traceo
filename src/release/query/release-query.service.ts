import { Injectable } from "@nestjs/common";
import { BaseDtoQuery } from "src/core/generic.model";
import { GenericQueryService } from "src/core/generic-query.service";
import { Release } from "src/db/entities/release.entity";
import { Brackets, EntityManager, SelectQueryBuilder } from "typeorm";
import { Incident } from "src/db/entities/incident.entity";

@Injectable()
export class ReleaseQueryService extends GenericQueryService<Release, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Release)
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Release>, query: BaseDtoQuery): SelectQueryBuilder<Release> {
        const { appId, search, env } = query;

        builder.where('release.applicationId = :appId', { appId })
            .andWhere('release.env = :env', { env })

        if (search) {
            builder
                .andWhere(new Brackets(qb => {
                    qb.where('LOWER(release.version) LIKE LOWER(:search)', { search: `%${search}%` })
                }));
        }

        return builder;
    }

    public getBuilderAlias(): string {
        return 'release';
    }

    public selectedColumns(): string[] {
        return ['id', 'env', 'version', 'lastDeploymentAt', 'incidentsOccurCount', 'incidentsCount'];
    }

    public async getIncidentsCatchedInRelease(id: number, version: string): Promise<Incident[]> {
        const incidents = await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .leftJoin('incident.application', 'application', 'application.id = :id', { id })
            .orderBy('incident.createdAt', 'DESC')
            .getMany();

        return incidents?.filter((incident) => incident.occurDates.some((a) => a.version?.name === version));
    }

    public async getIncidentsResolvedInRelease(id: string): Promise<Incident[]> {
        return await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .leftJoinAndSelect('incident.resolved', 'resolved')
            .where('resolved.id = :id', { id })
            .getMany();
    }
}