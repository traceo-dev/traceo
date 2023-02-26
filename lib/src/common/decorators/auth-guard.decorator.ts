import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request?.user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
