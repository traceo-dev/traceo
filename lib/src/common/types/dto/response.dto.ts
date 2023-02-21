export type ResponseStatus = "success" | "error";

export class ApiResponse<T> {
  constructor(status: ResponseStatus, message?: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  public status: ResponseStatus;
  public message: string;
  public data?: T | unknown;
}
