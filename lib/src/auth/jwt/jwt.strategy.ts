import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt.payload.interface";
import { config } from "dotenv";
import { UserQueryService } from "../../api/user/user-query/user-query.service";

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private UserQueryService: UserQueryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // const { id } = payload;
    // const user = await this.UserQueryService.getDto(id);

    // if (!user) {
    //   throw new UnauthorizedException("Unauthorized!");
    // }

    return payload;
  }
}
