import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContext } from './request-context.model';
import { Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { SESSION_NAME } from '@common/helpers/constants';
import { Session } from '@db/entities/session.entity';
import { RequestUser } from '@common/types/interfaces/account.interface';

interface ExtendedRequest extends Request {
    user: RequestUser
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware<Request, Response> {
    constructor(
        private entityManger: EntityManager,
    ) { }

    async use(req: ExtendedRequest, res: Response, next: () => void) {
        const sessionID = req.cookies[SESSION_NAME];
        const session = await this.entityManger.getRepository(Session).findOne({
            where: { sessionID },
        });
        if (!session) {
            this.run(req, res, next);
        }

        req.user = {
            id: session.accountID,
            username: session.accountName
        };

        this.run(req, res, next);
    }

    private run(req: ExtendedRequest, res: Response, next: () => void): void {
        RequestContext.cls.run(new RequestContext(req, res), next);
    }
}