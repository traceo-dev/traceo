import { AsyncLocalStorage } from 'async_hooks';
import { RequestUser } from '@shared/interfaces/account.interface';

export class RequestContext<TRequest = any, TResponse = any> {
    constructor(public readonly req: TRequest, public readonly res: TResponse) { }

    static cls = new AsyncLocalStorage<RequestContext>();

    static get currentContext() {
        return this.cls.getStore();
    }

    static get user(): RequestUser {
        return this.currentContext.req.user;
    }
}