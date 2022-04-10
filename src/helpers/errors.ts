export class KlepperError extends Error {
    public status: number;

    getStatus() {
        return this.status;
    }
}

// "Something was wrong with the request you made."
export class BadRequestError extends KlepperError {
    constructor(message?) {
        super(message || 'Something was wrong...');
        this.name = 'BadRequestError';
        this.status = 400;
    }
}

// "I know who you are, but you did not have my permission to do this."
export class ForbiddenError extends KlepperError {
    constructor(message?) {
        super(message || 'Access denied.');
        this.name = 'ForbiddenError';
        this.status = 402;
    }
}

// "You asked for something that I could not find."
export class NotFoundError extends KlepperError {
    constructor(message?) {
        super(message || 'Not found.');
        this.name = 'NotFoundError';
        this.status = 404;
    }
}

// "I do not know who you are."
export class UnauthorizedError extends KlepperError {
    constructor(message?) {
        super(message || 'Unatuthorized.');
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}

export class BadPasswordOrNotExists extends KlepperError {
    constructor(message?) {
        super(message || 'Bad password or account does not exists.');
        this.name = 'BadPasswordOrNotExists';
        this.status = 452;
    }
}

export class AccountNotExistsError extends KlepperError {
    constructor(message?) {
        super(message || 'Account not exists.');
        this.name = 'AccountNotExistsError';
        this.status = 453;
    }
}

export class AccountAlreadyExistsError extends KlepperError {
    constructor(message?) {
        super(message || 'Account already exists.');
        this.name = 'AccountAlreadyExistsError';
        this.status = 454;
    }
}

export class WorkspaceWithNameAlreadyExistsError extends KlepperError {
    constructor(message?) {
        super(message || 'Workspace with this name already exists.');
        this.name = 'WorkspaceWithNameAlreadyExistsError';
        this.status = 455;
    }
}

export class AccountAlreadyInWorkspaceError extends KlepperError {
    constructor(message?) {
        super(message || 'Account already exists in this workspace.');
        this.name = 'AccountAlreadyInWorkspaceError';
        this.status = 455;
    }
}

export class WorkspaceNotExistsError extends KlepperError {
    constructor(message?) {
        super(message || 'Workspace not exists.');
        this.name = 'WorkspaceNotExistsError';
        this.status = 456;
    }
}

export class InternalServerError extends KlepperError {
    constructor(message?) {
        super(message || 'Internal server error.');
        this.name = 'InternalServerError';
        this.status = 500;
    }
}
