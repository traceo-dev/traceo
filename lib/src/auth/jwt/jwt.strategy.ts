import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt.payload.interface';
import { config } from "dotenv";
import { AccountQueryService } from '../../api/account/account-query/account-query.service';

config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private accountQueryService: AccountQueryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { id } = payload;
    const user = await this.accountQueryService.getDto(id);

    if (!user) {
      throw new UnauthorizedException("Unauthorized!");
    }

    return payload;
  }
}
