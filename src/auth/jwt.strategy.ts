import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt.payload.interface';
import { AccountQueryService } from 'src/account/account-query/account-query.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private accountQueryService: AccountQueryService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        const { id, name, email, logo } = payload;
        const user = await this.accountQueryService.getAccountByEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException('Unauthorized!');
        }

        return { id, name, email, logo };
    }
}