import { Injectable } from "@nestjs/common";
import { RequestUser } from "src/auth/auth.model";
import { GenericQueryService } from "src/core/generic-query.service";
import { Incident } from "src/db/entities/incident.entity";
import { IncidentQueryDto, IncidentStatusSearch } from "src/db/models/incident";
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class IncidentsQueryService extends GenericQueryService<Incident, IncidentQueryDto> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Incident);
    }

    override async getDto(id: string): Promise<Incident> {
        return await this.repository
            .createQueryBuilder('incident')
            .where('incident.id = :id', { id })
            .leftJoin('incident.assigned', 'assigned')
            .leftJoin('incident.resolved', 'resolved')
            .loadRelationCountAndMap('incident.commentsCount', 'incident.comments')
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"])
            .addSelect(["resolved.id", "resolved.version"])
            .getOne();
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Incident>, query: IncidentQueryDto): SelectQueryBuilder<Incident> {
        const { appId } = query;

        builder.where('incident.applicationId = :appId', { appId })

        this.commonQuery(builder, query);

        builder
            .leftJoin('incident.assigned', 'assigned')
            .loadRelationCountAndMap('incident.commentsCount', 'incident.comments')
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"]);

        return builder;
    }

    public getBuilderAlias(): string {
        return 'incident';
    }

    public selectedColumns(): string[] {
        return ['id', 'status', 'env', 'type', 'message', 'lastOccur', 'occuredCount', 'release', 'release', 'occurDates', 'githubIssueUrl'];
    }

    public async getAssignedIncidents(query: IncidentQueryDto, user: RequestUser): Promise<Incident[]> {
        const { take, sortBy, order, page, size } = query;
        const queryBuilder = await this.entityManager.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.assignedId = :id', { id: user.id })
            .leftJoinAndSelect('incident.application', 'application')
            .leftJoinAndSelect('incident.assigned', 'assigned');

        this.commonQuery(queryBuilder, query);

        queryBuilder
            .orderBy(`incident.${sortBy}`, order)
            .limit(size)
            .skip(page > 0 ? (page - 1) * take : 0);

        return queryBuilder.getMany();
    }

    public commonQuery(builder: SelectQueryBuilder<Incident>, query: IncidentQueryDto) {
        const { search, status, size } = query;

        if (status && status !== IncidentStatusSearch.ALL) {
            builder.andWhere('incident.status = :status', { status })
        }

        if (search) {
            builder
                .andWhere(new Brackets(qb => {
                    qb.where('LOWER(incident.message) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.type) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.status) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.release) LIKE LOWER(:search)', { search: `%${search}%` })
                }));
        }

        if (size) {
            builder.limit(size);
        }
    }
}
