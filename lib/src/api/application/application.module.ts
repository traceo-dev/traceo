import { Module } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApplicationController } from "./application.controller";
import { MemberService } from "../member/member.service";
import { PassportModule } from "@nestjs/passport";
import { ApplicationQueryService } from "./application-query/application-query.service";
import { MemberQueryService } from "../member/member-query/member-query.service";
import { UserQueryService } from "../user/user-query/user-query.service";
import { MetricsService } from "../metrics/metrics.service";
import { ApplicationsController } from "./applications.controller";
import { DataSourceService } from "../datasource/dataSource.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [
    ApplicationService,
    ApplicationQueryService,
    MemberService,
    MemberQueryService,
    UserQueryService,
    MetricsService,
    DataSourceService
  ],
  controllers: [ApplicationsController, ApplicationController],
  exports: [ApplicationService, ApplicationQueryService]
})
export class ApplicationModule {}
