import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get("/heartbeat")
  heartbeat(): string {
    return `Traceo - backend, v.${process.env.VERSION} - ${process.env.NODE_ENV}`
  }
}
