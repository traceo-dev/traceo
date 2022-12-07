import { Injectable, Logger } from '@nestjs/common';
import { Account } from '../db/entities/account.entity';
import {
  AccountMemberRelationship
} from '../db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import { AmrQueryService } from './amr-query/amr-query.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import dateUtils from '../helpers/dateUtils';
import { Application } from '../db/entities/application.entity';
import { MemberRole } from '../../lib/types/enums/amr.enum';
import { AddAccountToApplicationDto, UpdateAmrDto } from '../../lib/types/dto/amr.dto';
import { ApiResponse } from '../../lib/types/dto/response.dto';
import { INTERNAL_SERVER_ERROR } from '../../lib/helpers/constants';

/**
 * AMR - Application-Member-Relationship
 */

@Injectable()
export class AmrService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrQueryService: AmrQueryService,
    private readonly accountQueryService: AccountQueryService,
    private readonly applicationQueryService: ApplicationQueryService,
  ) {
    this.logger = new Logger(AmrService.name)
  }

  public async createAmr(
    account: Account,
    application: Application,
    role: MemberRole = MemberRole.VIEWER,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    await manager.getRepository(AccountMemberRelationship).save({
      account,
      application,
      role,
      createdAt: dateUtils.toUnix(),
      updatedAt: dateUtils.toUnix()
    });
  }

  public async addAccountToApplication(
    body: AddAccountToApplicationDto,
  ): Promise<ApiResponse<unknown>> {
    const { applicationId, accountId, role } = body;
    return this.entityManager.transaction(async (manager) => {
      const exists = await this.awrQueryService.awrExists(
        { accountId, applicationId },
        manager,
      );
      if (exists) {
        return new ApiResponse("error", "Account is already in this application");
      }

      const account = await this.accountQueryService.getDto(accountId);
      const application = await this.applicationQueryService.getDto(applicationId);

      await this.createAmr(account, application, role);

      return new ApiResponse("success", "Account successfully added to application");
    }).catch((err: Error) => {
      this.logger.error(`[${this.addAccountToApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async updateApplicationAccount(
    awrModel: UpdateAmrDto,
    manager: EntityManager = this.entityManager,
  ): Promise<ApiResponse<unknown>> {
    const { memberId, ...rest } = awrModel;
    try {
      await manager
        .getRepository(AccountMemberRelationship)
        .update({ id: memberId }, rest);

      return new ApiResponse("success", "Updated")
    } catch (err) {
      this.logger.error(`[${this.updateApplicationAccount.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async removeAccountFromApplication(id: string): Promise<ApiResponse<unknown>> {
    try {
      await this.removeAwr(id);
      return new ApiResponse("success", "Removed from application");
    } catch (err) {
      this.logger.error(`[${this.removeAccountFromApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  private async removeAwr(
    id: string,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    await manager.getRepository(AccountMemberRelationship).delete({ id });
  }
}
