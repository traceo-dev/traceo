import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get("/heartbeat")
  heartbeat(): string {
    return `Klepper - backend, v.${process.env.VERSION} - ${process.env.ENVIRONMENT}`
  }
}
