import { Injectable } from '@nestjs/common';
import { Account } from '../db/entities/account.entity';
import {
  AccountMemberRelationship
} from '../db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { AmrQueryService } from './amr-query/amr-query.service';
import { AccountAlreadyInApplicationError } from '../helpers/errors';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import dateUtils from '../helpers/dateUtils';
import { Application } from '../db/entities/application.entity';
import { Incident } from '../db/entities/incident.entity';
import { MemberRole } from '../../lib/types/enums/amr.enum';
import { AddAccountToApplicationDto, UpdateAmrDto } from '../../lib/types/dto/amr.dto';

/**
 * AMR - Application-Member-Relationship
 */

@Injectable()
export class AmrService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrQueryService: AmrQueryService,
    private readonly accountQueryService: AccountQueryService,
    private readonly applicationQueryService: ApplicationQueryService,
  ) { }

  public async createAmr(
    account: Account,
    application: Application,
    role: MemberRole = MemberRole.VIEWER,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    const awr: Partial<AccountMemberRelationship> = {
      account,
      application,
      role,
      createdAt: dateUtils.toUnix(),
      updatedAt: dateUtils.toUnix()
    };
    await manager.getRepository(AccountMemberRelationship).save(awr);
  }

  public async addAccountToApplication(
    body: AddAccountToApplicationDto,
  ): Promise<void> {
    const { applicationId, accountId, role } = body;
    await this.entityManager.transaction(async (manager) => {
      const exists = await this.awrQueryService.awrExists(
        { accountId, applicationId },
        manager,
      );
      if (exists) {
        throw new AccountAlreadyInApplicationError();
      }

      const account = await this.accountQueryService.getDto(accountId);
      const application = await this.applicationQueryService.getDto(applicationId);

      await this.createAmr(account, application, role);
    });
  }

  public async updateApplicationAccount(
    awrModel: UpdateAmrDto,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    const { memberId, ...rest } = awrModel;
    await manager
      .getRepository(AccountMemberRelationship)
      .update({ id: memberId }, rest);
  }

  public async removeAccountFromApplication(awrId: string): Promise<void> {
    return this.removeAwr(awrId);
  }

  private async removeAwr(
    awrId: string,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    await manager.getRepository(AccountMemberRelationship).delete({ id: awrId });
  }

  public async leaveApplication(id: string, appId: number): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const assignedIncidents = await manager.getRepository(Incident).find({
        where: {
          assigned: { id }
        }
      });

      const promises = assignedIncidents?.map(async (incident) => {
        await this.entityManager
          .getRepository(Incident)
          .update({ id: incident.id }, { assigned: null });
      });
      await Promise.all(promises);

      const amr = await this.entityManager
        .getRepository(AccountMemberRelationship)
        .findOneBy({
          account: { id },
          application: {
            id: appId
          }
        });

      if (!amr) {
        throw new Error("Relationship does not exists!");
      }

      await this.removeAccountFromApplication(amr.id);
    });
  }
}
