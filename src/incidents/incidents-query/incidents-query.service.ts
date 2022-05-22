import { Injectable } from "@nestjs/common";
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
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"])
            .getOne();
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Incident>, query: IncidentQueryDto): SelectQueryBuilder<Incident> {
        const { search, status, workspaceId } = query;

        builder.where('incident.workspaceId = :workspaceId', { workspaceId })

        if (status && status !== IncidentStatusSearch.ALL) {
            builder.where('incident.status = :status', { status })
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

        builder
            .leftJoin('incident.assigned', 'assigned')
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"]);

        return builder;
    }

    public getBuilderAlias(): string {
        return 'incident';
    }

    public selectedColumns(): string[] {
        return ['id', 'status', 'env', 'type', 'message', 'lastOccur', 'occuredCount', 'release', 'release', 'occurDates', 'githubIssueUrl'];
    }
}
