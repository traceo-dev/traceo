import { Module } from "@nestjs/common";
import { UserQueryService } from "../user/user-query/user-query.service";
import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";

@Module({
  imports: [],
  providers: [ViewService, UserQueryService],
  controllers: [ViewController],
  exports: [ViewService]
})
export class ViewModule {}
