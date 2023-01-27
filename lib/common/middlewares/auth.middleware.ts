import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { Session } from 'lib/db/entities/session.entity';

interface RequestWithUser extends Request {
    user: {
        id: string;
        username: string;
    };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private entityManger: EntityManager,
    ) { }

    async use(req: RequestWithUser, _res: Response, next: () => void) {
        const sessionID = req.cookies["traceo_session"];
        if (!sessionID) {
            return next();
        }

        const session = await this.entityManger.getRepository(Session).findOne({
            where: { sessionID },
        });
        if (!session) {
            return next();
        }

        req.user = {
            id: session.accountID,
            username: session.accountName
        };

        next();
    }
}
