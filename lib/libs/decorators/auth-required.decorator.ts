import { Expose, ExposeOptions } from 'class-transformer';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller } from '@nestjs/common/interfaces';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function AuthRequired(
  exposeOptions?: ExposeOptions,
): (
  arg0: Controller,
  arg1: string,
  arg3: TypedPropertyDescriptor<unknown>,
) => void {
  const exposeFn = Expose(exposeOptions);
  const apiBearerAuthFn = ApiBearerAuth();
  const guardFn = UseGuards(AuthGuard());

  return function (
    target: Controller,
    key: string,
    descriptor: TypedPropertyDescriptor<unknown>,
  ): void {
    apiBearerAuthFn(target, key, descriptor);
    guardFn(target, key, descriptor);
    exposeFn(target, key);
  };
}
