import { Injectable, Logger } from '@nestjs/common';
import { BaseDtoQuery } from 'src/core/generic.model';
import { GenericQueryService } from 'src/core/generic-query.service';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Application } from 'src/db/entities/application.entity';
import { RequestUser } from 'src/auth/auth.model';
import { AccountMemberRelationship } from 'src/db/entities/account-member-relationship.entity';
import { ApplicationResponse } from 'src/types/application';

@Injectable()
export class ApplicationQueryService extends GenericQueryService<Application, BaseDtoQuery> {
    constructor(
        readonly entityManager: EntityManager
    ) {
        super(entityManager, Application);
    }

    public override async getDto(id: number): Promise<Application> {
        return await this.entityManager.getRepository(Application).findOneBy({ id });
    }

    public async getApplications(pageOptionsDto: BaseDtoQuery): Promise<Application[]> {
        const { order, take, search, page } = pageOptionsDto;
        let queryBuilder = this.entityManager
            .getRepository(Application)
            .createQueryBuilder("application");

        if (search) {
            queryBuilder.where("LOWER(application.name) LIKE LOWER(:name)", { name: `%${search}%` })
        }

        queryBuilder
            .orderBy("application.updatedAt", order)
            .skip((page - 1) * take)
            .take(take);

        return await queryBuilder.getMany();
    }

    public async getApplication(appId: number, user: RequestUser): Promise<ApplicationResponse | null> {
        const { id } = user;

        const applicationQuery = await this.entityManager.getRepository(AccountMemberRelationship)
            .createQueryBuilder("accountApplicationRelationship")
            .where('accountApplicationRelationship.application = :appId', { appId })
            .innerJoin("accountApplicationRelationship.account", "account", "account.id = :id", { id })
            .innerJoinAndSelect("accountApplicationRelationship.application", "application")
            .innerJoinAndSelect("application.owner", "owner")
            .getOne();
        
        if (!applicationQuery) {
            return null;
        }

        const { role, application } = applicationQuery;

        return {
            ...application,
            member: {
                role
            },
            owner: {
                name: application?.owner.name
            }
        }
    }

    public async getApplicationByName(name: string): Promise<Application | null> {
        return this.repository.findOneBy({ name });
    }

    public getBuilderAlias(): string {
        return 'application';
    }

    public extendQueryBuilder(builder: SelectQueryBuilder<Application>, query: BaseDtoQuery): SelectQueryBuilder<Application> {
        throw new Error('Method not implemented.');
    }

    public selectedColumns(): string[] {
        throw new Error('Method not implemented.');
    }
}
