import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchException } from "traceo";

@Injectable()
export class TraceoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(null, (exception) => {
        catchException(exception);
      }),
    );
  }
}
