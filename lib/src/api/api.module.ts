import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user/user.controller";
import { UserModule } from "./user/user.module";
import { MemberController } from "./member/member.controller";
import { MemberModule } from "./member/member.module";
import { ProjectController } from "./project/project.controller";
import { ProjectModule } from "./project/project.module";
import { IncidentCommentsController } from "./incidents/incident-comments/incident-comments.controller";
import { IncidentsController } from "./incidents/incidents.controller";
import { IncidentsModule } from "./incidents/incidents.module";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsModule } from "./metrics/metrics.module";
import { StatisticsController } from "./statistics/statistics.controller";
import { StatisticsModule } from "./statistics/statistics.module";
import { UsersController } from "./user/users.controller";
import { ProjectsController } from "./project/projects.controller";
import { IncidentCommentsModule } from "./incidents/incident-comments/incident-comments.module";
import { RequestContextMiddleware } from "../common/middlewares/request-context/request-context.middleware";
import { AuthController } from "../auth/auth.controller";
import { ViewController } from "./view/view.controller";
import { ViewModule } from "./view/view.module";
import { CaptureController } from "./capture/capture.controller";
import { CaptureModule } from "./capture/capture.module";
import { EventModule } from './event/event.module';
import { PerformanceModule } from './performance/performance.module';
import { PerformanceController } from "./performance/performance.controller";
import { AlertModule } from './alert/alert.module';
import { AlertController } from "./alert/alert.controller";

const apiControllers = [
  UserController,
  UsersController,
  ProjectController,
  ProjectsController,
  MemberController,
  IncidentCommentsController,
  IncidentsController,
  StatisticsController,
  MetricsController,
  AuthController,
  ViewController,
  CaptureController,
  PerformanceController,
  AlertController
];
@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
    ProjectModule,
    MemberModule,
    IncidentsModule,
    IncidentCommentsModule,
    StatisticsModule,
    HttpModule,
    MetricsModule,
    ViewModule,
    CaptureModule,
    EventModule,
    PerformanceModule,
    AlertModule
  ],
  controllers: apiControllers
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .exclude(
        { path: "/api/capture/(.*)", method: RequestMethod.ALL },
        { path: "/api/view/(.*)", method: RequestMethod.ALL },
        { path: "/api/auth/login", method: RequestMethod.POST }
      )
      .forRoutes(...apiControllers);
  }
}
