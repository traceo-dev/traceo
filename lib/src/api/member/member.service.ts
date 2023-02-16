import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { MemberQueryService } from './member-query/member-query.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { UserQueryService } from '../user/user-query/user-query.service';
import { INTERNAL_SERVER_ERROR } from '../../common/helpers/constants';
import dateUtils from '../../common/helpers/dateUtils';
import { CreateMemberDto, UpdateMemberDto } from '../../common/types/dto/member.dto';
import { Member } from '../../db/entities/member.entity';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { MemberRole } from '@traceo/types';
import { Application } from '../../db/entities/application.entity';
import { User } from '../../db/entities/user.entity';


/**
 * Member is an user attached to application
 */

@Injectable()
export class MemberService {
  private readonly logger: Logger;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly awrQueryService: MemberQueryService,
    private readonly userQueryService: UserQueryService,
    private readonly applicationQueryService: ApplicationQueryService,
  ) {
    this.logger = new Logger(MemberService.name)
  }

  public async addUserToApplication(
    body: CreateMemberDto,
  ): Promise<ApiResponse<unknown>> {
    const { applicationId, userId, role } = body;
    return this.entityManager.transaction(async (manager) => {
      const exists = await this.awrQueryService.memberExists(
        { userId, applicationId },
        manager,
      );
      if (exists) {
        return new ApiResponse("error", "User is already in this application");
      }

      const user = await this.userQueryService.getDto(userId);
      const application = await this.applicationQueryService.getDto(applicationId);

      await this.createMember(user, application, role);

      return new ApiResponse("success", "User successfully added to application");
    }).catch((err: Error) => {
      this.logger.error(`[${this.addUserToApplication.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async updateMember(
    awrModel: UpdateMemberDto,
    manager: EntityManager = this.entityManager,
  ): Promise<ApiResponse<unknown>> {
    const { memberId, ...rest } = awrModel;
    try {
      await manager
        .getRepository(Member)
        .update({ id: memberId }, rest);

      return new ApiResponse("success", "Updated")
    } catch (err) {
      this.logger.error(`[${this.updateMember.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async removeMember(id: string): Promise<ApiResponse<unknown>> {
    try {
      await this.entityManager.getRepository(Member).delete({ id });
      return new ApiResponse("success", "Removed from application");
    } catch (err) {
      this.logger.error(`[${this.removeMember.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }


  public async createMember(
    user: User,
    application: Application,
    role: MemberRole = MemberRole.VIEWER,
    manager: EntityManager = this.entityManager,
  ): Promise<void> {
    await manager.getRepository(Member).save({
      user,
      application,
      role,
      createdAt: dateUtils.toUnix(),
      updatedAt: dateUtils.toUnix()
    });
  }
}
