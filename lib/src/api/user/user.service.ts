import { Injectable, Logger } from '@nestjs/common';
import { UserQueryService } from './user-query/user-query.service';
import { MemberService } from '../member/member.service';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { HttpService } from "@nestjs/axios";
import { INTERNAL_SERVER_ERROR, ADMIN_EMAIL } from "../../common/helpers/constants";
import dateUtils from "../../common/helpers/dateUtils";
import { UserWithUsernameAlreadyExistsError, UserEmailAlreadyExistsError } from "../../common/helpers/errors";
import { gravatar } from "../../common/helpers/gravatar";
import tokenService from "../../common/helpers/tokens";
import { CreateUserDto, UserDto } from '../../common/types/dto/user.dto';
import { User } from '../../db/entities/user.entity';
import { EntityManager } from 'typeorm';
import { UserStatus } from "@traceo/types";
import { ApiResponse } from "../../common/types/dto/response.dto";
import { RequestContext } from '../../common/middlewares/request-context/request-context.model';
import { AuthTokenService } from '../../auth/auth-token.service';


@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    readonly entityManager: EntityManager,
    readonly UserQueryService: UserQueryService,
    readonly applicationQueryService: ApplicationQueryService,
    readonly awrService: MemberService,
    readonly httpService: HttpService,
    readonly tokenService: AuthTokenService
  ) {
    this.logger = new Logger(UserService.name);
  }

  public async createUser(userDto: CreateUserDto): Promise<any> {
    const { name, email, password, username } = userDto;

    await this.checkDuplicate(username, email);

    try {
      const url = gravatar.url(username || email, "retro");
      const payload: Partial<User> = {
        email,
        name,
        username: username.toLowerCase(),
        password: tokenService.generate(password),
        isAdmin: false,
        gravatar: url,
        status: UserStatus.INACTIVE,
        createdAt: dateUtils.toUnix()
      };

      const user = await this.entityManager.getRepository(User).save(payload);

      return new ApiResponse("success", "New user account has been created", {
        id: user.id
      });
    } catch (error) {
      this.logger.error(`[${this.createUser.name}] Caused by: ${error}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, error);
    }
  }

  public async updateUser(
    userDto: UserDto,
  ): Promise<ApiResponse<unknown>> {
    const { email } = userDto;

    if (email === ADMIN_EMAIL) {
      return new ApiResponse("error", "The administrator account cannot be modified")
    }

    try {
      await this.entityManager.getRepository(User).update({ id: userDto.id }, { ...userDto });
      return new ApiResponse("success", "User updated")
    } catch (err) {
      this.logger.error(`[${this.updateUser.name}] Caused by: ${err}`)
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    }
  }

  public async deleteUser(id: string): Promise<ApiResponse<unknown>> {
    const userId = RequestContext.user.id;
    return this.entityManager.transaction(async (manager) => {
      const user = await manager
        .getRepository(User)
        .findOneBy({ id: userId });

      if (!user.isAdmin) {
        return new ApiResponse("error", "Only users with admin role can remove other account")
      }

      await this.tokenService.revokeAllUserTokens(id, manager);
      await manager.getRepository(User).delete({ id });

      this.logger.log(`[${this.deleteUser.name}] User with id: ${id} removed.`);
      return new ApiResponse("success", "User successfully removed");
    }).catch((err: Error) => {
      this.logger.error(`[${this.deleteUser.name}] Caused by: ${err}`)
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  private async checkDuplicate(username: string, email: string) {
    const user = await this.UserQueryService.getDtoBy({
      username: username && username.toLowerCase()
    });
    if (user) {
      throw new UserWithUsernameAlreadyExistsError();
    }

    if (email) {
      await this.UserQueryService.getDtoBy({ email }).then((user) => {
        if (user) {
          throw new UserEmailAlreadyExistsError();
        }
      });
    }
  }
}
