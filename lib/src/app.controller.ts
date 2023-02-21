import { Controller, Get } from "@nestjs/common";
import { VERSION } from "./common/helpers/constants";

@Controller()
export class AppController {
  @Get("/heartbeat")
  async heartbeat(): Promise<any> {
    return `Traceo, v.${VERSION} - ${process.env.NODE_ENV}`;
  }
}
