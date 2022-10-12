import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RequestUser } from 'lib/auth/auth.model';
import { AmrService } from 'lib/application-member/amr.service';
import { Account } from 'lib/db/entities/account.entity';
import { Application } from 'lib/db/entities/application.entity';
import { MemberRole } from 'lib/db/entities/account-member-relationship.entity';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { ApplicationWithNameAlreadyExistsError } from 'lib/helpers/errors';
import { CreateApplicationBody, ApplicationBody } from './application.model';
import dateUtils from 'lib/helpers/dateUtils';
import { ApplicationQueryService } from './application-query/application-query.service';
import { gravatar } from 'lib/libs/gravatar';
import { AccountQueryService } from 'lib/account/account-query/account-query.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Log } from 'lib/db/entities/log.entity';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrService: AmrService,
    private readonly applicationQueryService: ApplicationQueryService,
    private readonly accountQueryService: AccountQueryService
  ) { }

  public async createApplication(
    data: CreateApplicationBody,
    user: RequestUser,
  ): Promise<Application> {
    const { id, email } = user;

    const privateKey = crypto.randomUUID();
    try {
      return await this.entityManager.transaction(async (manager) => {
        await this.validate(data.name);

        const account = await manager.getRepository(Account).findOneBy({ id });
        if (!account) {
          throw new NotFoundException();
        }
        const url = gravatar.url(data.name, "identicon");
        const applicationPayload: Application = {
          ...data,
          privateKey,
          owner: account,
          gravatar: url,
          createdAt: dateUtils.toUnix(),
          updatedAt: dateUtils.toUnix()
        };

        const application = await manager
          .getRepository(Application)
          .save(applicationPayload);

        if (email !== "admin@localhost") {
          const admin = await this.accountQueryService.getDtoBy({ email: "admin@localhost" });
          await this.awrService.createAmr(
            admin,
            application,
            MemberRole.ADMINISTRATOR,
            manager,
          );
        }

        await this.awrService.createAmr(
          account,
          application,
          MemberRole.ADMINISTRATOR,
          manager,
        );

        return application;
      });
    } catch (error) {
      Logger.error(`[${this.createApplication.name}] Caused by: ${error}`);
      throw new Error(error);
    }
  }

  public async updateApplication(
    appBody: ApplicationBody | Partial<Application>,
    account: RequestUser,
    manager: EntityManager = this.entityManager,
  ): Promise<any> {
    const { id, ...rest } = appBody;
    const { name } = rest;

    try {
      if (name) {
        await this.validate(name);
      }

      await manager.getRepository(Application).update(
        { id },
        {
          updatedAt: dateUtils.toUnix(),
          ...rest
        },
      );
    } catch (error) {
      Logger.error(`[${this.updateApplication.name}] Caused by: ${error}`);
      throw new Error(error);
    }
  }

  private async validate(
    name: string
  ): Promise<void> {
    const application = await this.applicationQueryService.getDtoBy({ name });
    if (application) {
      throw new ApplicationWithNameAlreadyExistsError();
    }
  }

  public async deleteApplication(
    appId: string,
    user: RequestUser,
  ): Promise<void> {
    //check here permission, create util for this

    await this.entityManager
      .getRepository(Application)
      .createQueryBuilder('application')
      .where('application.id = :appId', { appId })
      .delete()
      .execute();
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  private async handleLogDelete() {
    try {
      const maxRetentionDate = dayjs().subtract(3, 'd').unix();
      const logs = await this.entityManager.getRepository(Log)
        .createQueryBuilder('log')
        .where('log.receiveTimestamp > :maxRetentionDate', { maxRetentionDate })
        .getMany();

      await this.entityManager.getRepository(Log).remove(logs);

      Logger.log(`[handleLogDelete] Delete logs: ${logs.length}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
