export class TraceoError extends Error {
  public status: number;

  getStatus() {
    return this.status;
  }
}

export class BadRequestError extends TraceoError {
  constructor(message?) {
    super(message || "Something was wrong...");
    this.name = "BadRequestError";
    this.status = 400;
  }
}

export class ForbiddenError extends TraceoError {
  constructor(message?) {
    super(message || "Access denied.");
    this.name = "ForbiddenError";
    this.status = 402;
  }
}

export class NotFoundError extends TraceoError {
  constructor(message?) {
    super(message || "Not found.");
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class UnauthorizedError extends TraceoError {
  constructor(message?) {
    super(message || "Unauthorized.");
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class UserNotExistsError extends TraceoError {
  constructor(message?) {
    super(message || "User not exists.");
    this.name = "UserNotExistsError";
    this.status = 453;
  }
}

export class InternalServerError extends TraceoError {
  constructor(message?) {
    super(message || "Internal server error.");
    this.name = "InternalServerError";
    this.status = 500;
  }
}
