import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get("/heartbeat")
  async heartbeat(): Promise<any> {
    return `Traceo - backend, v.${process.env.VERSION} - ${process.env.NODE_ENV}`;
  }
}
