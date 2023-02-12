import { Injectable, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Response, Request } from "express";
import { User } from '@db/entities/user.entity';
import { JwtService } from "@nestjs/jwt";
import { EntityManager } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { UserQueryService } from '../api/user/user-query/user-query.service';
import { UserService } from '../api/user/user.service';
import { INTERNAL_SERVER_ERROR, SESSION_EXPIRY_TIME, SESSION_NAME } from '@common/helpers/constants';
import { UserNotExistsError } from '@common/helpers/errors';
import { UserCredentialsDto, UpdatePasswordDto } from '@common/types/dto/user.dto';
import { IUser, UserStatus } from '@traceo/types';
import { ApiResponse } from '@common/types/dto/response.dto';
import { AuthTokenService } from './auth-token.service';
import { RequestContext } from '@common/middlewares/request-context/request-context.model';

export type LoginResponseType = { accessToken: string };
export type CheckCredentialsType = { isCorrect: boolean; user?: IUser };

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly userQueryService: UserQueryService,
    private readonly authTokenService: AuthTokenService,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  public async login(
    userCreds: UserCredentialsDto,
    res: Response,
    req: Request
  ) {
    return this.entityManager.transaction(async (manager) => {
      const { isCorrect, user } = await this.checkCredentials(
        userCreds,
        manager,
      );
      if (!isCorrect) {
        return new ApiResponse("error", "Bad username or password");
      }

      if (!user?.lastActiveAt) {
        await this.userService.updateUser({
          id: user.id,
          status: UserStatus.ACTIVE
        });
      }

      if (user.status === UserStatus.DISABLED) {
        return new ApiResponse("error", "User suspended. Contact with administrator of this Traceo Platform.");
      }

      const sessionId = await this.authTokenService.createUserToken({
        userID: user.id,
        userName: user.name
      }, req);

      res.cookie(SESSION_NAME, sessionId, {
        maxAge: SESSION_EXPIRY_TIME
      });

      return new ApiResponse("success", undefined, null);
    }).catch((err: Error) => {
      this.logger.error(`[${this.login.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  public async logout(req: Request, res: Response): Promise<ApiResponse<unknown>> {
    const sessionID = req.cookies[SESSION_NAME];
    if (!sessionID) {
      this.logger.error(`[${this.logout.name}] No session ID!`);
      return;
    }

    try {
      await this.authTokenService.revokeUserToken(sessionID);

      res.clearCookie(SESSION_NAME);
      return new ApiResponse("success", undefined, {
        redirectUrl: "/"
      });
    } catch (error) {
      this.logger.error(`[${this.logout.name}] Caused by: ${error}`);
    }
  }

  public async checkUserCredentials(credentials: UserCredentialsDto): Promise<ApiResponse<unknown>> {
    const { username } = RequestContext.user;
    const response = await this.checkCredentials({
      username,
      password: credentials.password
    });
    return new ApiResponse("success", undefined, {
      isCorrect: response.isCorrect
    });
  }

  public async checkCredentials(
    credentials: UserCredentialsDto,
    manager: EntityManager = this.entityManager,
  ): Promise<CheckCredentialsType> {
    const { username, password } = credentials;

    const user = await manager.getRepository(User).findOne({
      where: {
        username,
        password: createHmac("sha256", password).digest("hex")
      }
    });

    if (!user) {
      return {
        isCorrect: false
      };
    }

    return {
      isCorrect: true,
      user
    };
  }

  public async updateUserPassword(
    passwords: UpdatePasswordDto
  ): Promise<ApiResponse<unknown>> {
    const { id } = RequestContext.user;
    const { newPassword, password } = passwords;

    return this.entityManager.transaction(async (manager) => {
      const user = await this.userQueryService.getDto(id);
      if (!user) {
        throw new UserNotExistsError();
      }

      const credentials = new UserCredentialsDto(user?.username, password);
      const { isCorrect } = await this.checkCredentials(credentials, manager);
      if (!isCorrect) {
        return new ApiResponse("error", "Bad password!");
      }

      await manager.getRepository(User).save({
        ...user,
        password: createHmac('sha256', newPassword).digest('hex'),
        isPasswordUpdated: true
      });

      return new ApiResponse("success", "Password updated");
    }).catch((err: Error) => {
      this.logger.error(`[${this.updateUserPassword.name}] Caused by: ${err}`);
      return new ApiResponse("error", INTERNAL_SERVER_ERROR, err);
    });
  }

  private createToken(
    payload: JwtPayload,
  ): string {
    return this.jwtService.sign(payload);
  }
}
