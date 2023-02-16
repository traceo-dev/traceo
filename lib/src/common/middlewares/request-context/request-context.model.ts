import { AsyncLocalStorage } from 'async_hooks';
import { RequestUser } from '@traceo/types';

export class RequestContext<TRequest = any, TResponse = any> {
    constructor(public readonly req: TRequest, public readonly res: TResponse) { }

    // https://nodejs.org/api/async_context.html#class-asynclocalstorage
    static cls = new AsyncLocalStorage<RequestContext>();

    static get currentContext() {
        return this.cls.getStore();
    }

    static get user(): RequestUser {
        return this.currentContext.req.user;
    }
}