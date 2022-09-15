import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Env = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers["env"] || "";
});
