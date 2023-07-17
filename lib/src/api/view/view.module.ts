import { Module } from "@nestjs/common";
import { UserQueryService } from "../user/user-query/user-query.service";
import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";
import { DashboardQueryService } from "../dashboard/dashboard-query/dashboard-query.service";
import { MemberQueryService } from "../member/member-query/member-query.service";
import { ProjectQueryService } from "../project/project-query/project-query.service";

@Module({
  imports: [],
  providers: [
    ViewService,
    UserQueryService,
    DashboardQueryService,
    MemberQueryService,
    UserQueryService,
    ProjectQueryService
  ],
  controllers: [ViewController],
  exports: [ViewService]
})
export class ViewModule {}
