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
import { IncidentsController } from "./incidents/incidents.controller";
import { IncidentsModule } from "./incidents/incidents.module";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsModule } from "./metrics/metrics.module";
import { UsersController } from "./user/users.controller";
import { ProjectsController } from "./project/projects.controller";
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
import { TracingModule } from './tracing/tracing.module';
import { LogsModule } from './logs/logs.module';
import { LogsController } from "./logs/logs.controller";
import { DashboardModule } from './dashboard/dashboard.module';

const apiControllers = [
  UserController,
  UsersController,
  ProjectController,
  ProjectsController,
  MemberController,
  IncidentsController,
  MetricsController,
  AuthController,
  ViewController,
  CaptureController,
  PerformanceController,
  AlertController,
  LogsController
];
@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
    ProjectModule,
    MemberModule,
    IncidentsModule,
    HttpModule,
    MetricsModule,
    ViewModule,
    CaptureModule,
    EventModule,
    PerformanceModule,
    AlertModule,
    TracingModule,
    LogsModule,
    DashboardModule
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
