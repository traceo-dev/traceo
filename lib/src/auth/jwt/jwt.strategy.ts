import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./jwt.payload.interface";
import { config } from "dotenv";

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
