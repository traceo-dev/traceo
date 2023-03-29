import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { MemberService } from "../member/member.service";
import { PassportModule } from "@nestjs/passport";
import { ProjectQueryService } from "./project-query/project-query.service";
import { MemberQueryService } from "../member/member-query/member-query.service";
import { UserQueryService } from "../user/user-query/user-query.service";
import { MetricsService } from "../metrics/metrics.service";
import { ProjectsController } from "./projects.controller";
import { ClickhouseModule } from "src/common/services/clickhouse/clickhouse.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ClickhouseModule
  ],
  providers: [
    ProjectService,
    ProjectQueryService,
    MemberService,
    MemberQueryService,
    UserQueryService,
    MetricsService
  ],
  controllers: [ProjectsController, ProjectController],
  exports: [ProjectService, ProjectQueryService]
})
export class ProjectModule {}
