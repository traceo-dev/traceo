import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AmrService } from '../application-member/amr.service';
import { Application } from '../db/entities/application.entity';
import { EntityManager } from 'typeorm';
import * as crypto from "crypto";
import { ApplicationWithNameAlreadyExistsError } from '../helpers/errors';
import dateUtils from '../helpers/dateUtils';
import { ApplicationQueryService } from './application-query/application-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Log } from '../db/entities/log.entity';
import { ADMIN_EMAIL, ADMIN_NAME, INTERNAL_SERVER_ERROR } from '../helpers/constants';
import { MemberRole } from '../../lib/types/enums/amr.enum';
import { gravatar } from '../../lib/helpers/gravatar';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { ApplicationDto, CreateApplicationDto } from '../../lib/types/dto/application.dto';
import { ApiResponse } from '../../lib/types/dto/response.dto';

const MAX_RETENTION_LOGS = 3;

@Injectable()
export class ApplicationService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrService: AmrService,
    private readonly applicationQueryService: ApplicationQueryService,
    private readonly accountQueryService: AccountQueryService
  ) {
    this.logger = new Logger(ApplicationService.name)
  }

  public async createApplication(
    data: CreateApplicationDto,
    user: RequestUser,
  ): Promise<ApiResponse<Application>> {
    const { id, name } = user;

    const privateKey = crypto.randomUUID();
    console.log("createApplication")
    return await this.entityManager.transaction(async (manager) => {
      const app = await this.applicationQueryService.getDtoBy({ name: data.name });
      if (app) {
        return new ApiResponse("error", "Application with this name already exists.");
      }

      const account = await this.accountQueryService.getDtoBy({ id });
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
        updatedAt: dateUtils.toUnix(),
        incidentsCount: 0,
        errorsCount: 0,
        isIntegrated: false
      };

      const application = await manager
        .getRepository(Application)
        .save(applicationPayload);

      if (name !== ADMIN_NAME) {
        const admin = await this.accountQueryService.getDtoBy({ email: ADMIN_EMAIL });
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

      return new ApiResponse("success", "Application successfully created.", application);
    }).catch((err: Error) => {
      this.logger.error(`[${this.createApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async updateApplication(
    appBody: ApplicationDto | Partial<Application>
  ): Promise<ApiResponse<unknown>> {
    const { id, ...rest } = appBody;

    try {
      await this.entityManager.getRepository(Application).update(
        { id },
        {
          updatedAt: dateUtils.toUnix(),
          ...rest
        },
      );

      return new ApiResponse("success", "Application updated.")
    } catch (err) {
      this.logger.error(`[${this.updateApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
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
    appId: string
  ): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManager
        .getRepository(Application)
        .createQueryBuilder('application')
        .where('application.id = :appId', { appId })
        .delete()
        .execute();

      return new ApiResponse("success", "Application removed.");
    } catch (err) {
      this.logger.error(`[${this.deleteApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  private async handleLogDelete() {
    try {
      const maxRetentionDate = dayjs().subtract(MAX_RETENTION_LOGS, 'd').unix();
      const logs = await this.entityManager.getRepository(Log)
        .createQueryBuilder('log')
        .where('log.receiveTimestamp > :maxRetentionDate', { maxRetentionDate })
        .getMany();

      await this.entityManager.getRepository(Log).remove(logs);

      this.logger.log(`[handleLogDelete] Deleted logs: ${logs.length}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
