import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpAdapterHost,
  HttpStatus
} from "@nestjs/common";
import { TraceoError } from './helpers/errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: TraceoError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      status: httpStatus,
      timestamp: new Date().toISOString(),
      message: exception?.message
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
