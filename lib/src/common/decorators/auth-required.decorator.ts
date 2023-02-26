import { AuthGuard } from "./auth-guard.decorator";
import { UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common/interfaces";
import { Expose, ExposeOptions } from "class-transformer";

export function AuthRequired(
  exposeOptions?: ExposeOptions
): (arg0: Controller, arg1: string, arg3: TypedPropertyDescriptor<unknown>) => void {
  const exposeFn = Expose(exposeOptions);
  const guardFn = UseGuards(new AuthGuard());

  return function (
    target: Controller,
    key: string,
    descriptor: TypedPropertyDescriptor<unknown>
  ): void {
    guardFn(target, key, descriptor);
    exposeFn(target, key);
  };
}
