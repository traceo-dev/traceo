import { Injectable } from '@nestjs/common';
import { BaseDtoQuery } from '../../core/query/generic.model';
import { AccountMemberRelationship } from '../../db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { ApplicationDtoQuery } from '../../../lib/types/dto/application.dto';
import { IApplicationResponse } from '../../../lib/types/interfaces/application.interface';
import { RequestUser } from '../../../lib/types/interfaces/account.interface';

@Injectable()
export class AmrQueryService {
  constructor(private readonly entityManager: EntityManager) { }

  /**
   * Return pageable list of the members assigned to app
   *
   * @param appId
   * @param pageOptionsDto
   * @returns
   */
  public async getApplicationMembers(
    appId: number,
    pageOptionsDto: BaseDtoQuery,
  ): Promise<AccountMemberRelationship[]> {
    const { order, take, search, page } = pageOptionsDto;
    const queryBuilder = this.entityManager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder('amr')
      .innerJoin('amr.application', 'app', 'app.id = :appId', { appId })
      .leftJoin('amr.account', 'account');

    if (search) {
      queryBuilder.where("LOWER(account.name) LIKE LOWER(:name)", {
        name: `%${search}%`
      });
    }

    queryBuilder
      .addSelect([
        "account.name",
        "account.email",
        "account.id",
        "account.gravatar",
      ])
      .orderBy("amr.createdAt", order, "NULLS LAST")
      .skip((page - 1) * take)
      .take(take);

    return await queryBuilder.getMany();
  }

  /**
   * Return pageable list of the Apps assigned to account
   *
   * @param accountId
   * @param pageOptionsDto
   * @returns
   */

  public async getApplicationsForAccount(
    accountId: string,
    pageOptionsDto: ApplicationDtoQuery
  ): Promise<AccountMemberRelationship[]> {
    const { page, take, order, search, sortBy } = pageOptionsDto;
    const queryBuilder = this.entityManager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder("amr")
      .innerJoin("amr.account", "account", "account.id = :accountId", { accountId })
      .leftJoinAndSelect("amr.application", "application")
      .loadRelationCountAndMap("application.incidentsCount", "application.incidents")
      .leftJoin("application.owner", "owner");

    if (search) {
      queryBuilder
        .where("LOWER(application.name) LIKE LOWER(:name)", {
          name: `%${search}%`
        })
        .orWhere("LOWER(owner.name) LIKE LOWER(:name)", {
          name: `%${search}%`
        });
    }

    return await queryBuilder
      .addSelect(["owner.name", "owner.email", "owner.id", "owner.gravatar"])
      .orderBy(`application.${sortBy || "lastIncidentAt"}`, order, "NULLS LAST")
      .skip((page - 1) * take)
      .limit(take)
      .getMany();
  }

  public async awrExists(
    { accountId, applicationId }: { accountId: string; applicationId: number },
    manager: EntityManager = this.entityManager,
  ): Promise<boolean> {
    const count = await manager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder("amr")
      .where('amr.account = :accountId AND amr.application = :applicationId', { accountId, applicationId })
      .getCount();
    return count > 0;
  }

  public async getApplication(
    appId: number,
    user: RequestUser,
  ): Promise<IApplicationResponse> {
    const { id } = user;

    const applicationQuery = await this.entityManager
      .getRepository(AccountMemberRelationship)
      .createQueryBuilder("amr")
      .where('amr.application = :appId', { appId })
      .innerJoin("amr.account", "account", "account.id = :id", { id })
      .innerJoinAndSelect("amr.application", "application")
      .innerJoinAndSelect("application.owner", "owner")
      .leftJoinAndSelect("application.influxDS", "influxDS")
      .getOne();

    if (!applicationQuery) {
      return null;
    }

    return this.getApplicationResponse(applicationQuery);
  }

  private getApplicationResponse({ application, role }: AccountMemberRelationship): IApplicationResponse {
    return {
      ...application,
      member: {
        role
      },
      owner: {
        name: application.owner.name
      }
    }
  }
}
