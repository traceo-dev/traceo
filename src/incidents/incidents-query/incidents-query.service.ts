import { Injectable } from "@nestjs/common";
import { PageableDto } from "src/core/core.model";
import { CoreService } from "src/core/core.service";
import { Incident } from "src/db/entities/incident.entity";
import { IncidentSearchDto, IncidentStatusSearch } from "src/db/models/incident";
import { Brackets, EntityManager } from "typeorm";

@Injectable()
export class IncidentsQueryService extends CoreService {
    constructor(
        private entityManger: EntityManager
    ) {
        super();
    }

    async getIncident(id: string): Promise<Incident | null> {
        return await this.entityManger
            .getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.id = :id', { id })
            .leftJoin('incident.assigned', 'assigned')
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"])
            .getOne();
    }

    async getIncidents(workspaceId: string, pagination: IncidentSearchDto): Promise<PageableDto<Incident>> {
        const { skip, order, take, search, status, sortBy } = pagination;

        let queryBuilder = await this.entityManger.getRepository(Incident)
            .createQueryBuilder('incident')
            .where('incident.workspaceId = :workspaceId', { workspaceId })

        if (status && status !== IncidentStatusSearch.ALL) {
            queryBuilder.where('incident.status = :status', { status })
        }

        if (search) {
            queryBuilder
                .andWhere(new Brackets(qb => {
                    qb.where('LOWER(incident.message) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.type) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.status) LIKE LOWER(:search)', { search: `%${search}%` })
                        .orWhere('LOWER(incident.release) LIKE LOWER(:search)', { search: `%${search}%` })
                }));
        }

        queryBuilder
            .leftJoin('incident.assigned', 'assigned')
            .select(['incident.id', 'incident.status', 'incident.env', 'incident.type', 'incident.message', 'incident.lastOccur', 'incident.occuredCount', 'incident.release', 'incident.commentsCount', 'incident.occurDates'])
            .addSelect(["assigned.name", "assigned.email", "assigned.id", "assigned.logo"])
            .orderBy(`incident.${sortBy}`, order)
            .limit(take)
            .skip(skip);

        return this.preparePageable<Incident>(queryBuilder, pagination);
    }
}
