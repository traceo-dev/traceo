import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";
import { InfluxService } from "../providers/influx/influx.service";
import { UserController } from "./user/user.controller";
import { UserModule } from "./user/user.module";
import { MemberController } from "./member/member.controller";
import { MemberModule } from "./member/member.module";
import { ApplicationController } from "./application/application.controller";
import { ApplicationModule } from "./application/application.module";
import { DataSourceController } from "./datasource/dataSource.controller";
import { DataSourceModule } from "./datasource/dataSource.module";
import { IncidentCommentsController } from "./incidents/incident-comments/incident-comments.controller";
import { IncidentsController } from "./incidents/incidents.controller";
import { IncidentsModule } from "./incidents/incidents.module";
import { MetricsController } from "./metrics/metrics.controller";
import { MetricsModule } from "./metrics/metrics.module";
import { StatisticsController } from "./statistics/statistics.controller";
import { StatisticsModule } from "./statistics/statistics.module";
import { WorkerController } from "./worker/worker.controller";
import { WorkerModule } from "./worker/worker.module";
import { UsersController } from "./user/users.controller";
import { ApplicationsController } from "./application/applications.controller";
import { IncidentCommentsModule } from "./incidents/incident-comments/incident-comments.module";
import { RequestContextMiddleware } from "../common/middlewares/request-context/request-context.middleware";
import { AuthController } from "../auth/auth.controller";
import { ViewController } from "./view/view.controller";
import { ViewModule } from "./view/view.module";

const apiControllers = [
  UserController,
  UsersController,
  ApplicationController,
  ApplicationsController,
  MemberController,
  DataSourceController,
  IncidentCommentsController,
  IncidentsController,
  StatisticsController,
  WorkerController,
  MetricsController,
  AuthController,
  ViewController
];
@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
    ApplicationModule,
    MemberModule,
    DataSourceModule,
    IncidentsModule,
    IncidentCommentsModule,
    StatisticsModule,
    WorkerModule,
    HttpModule,
    MetricsModule,
    ViewModule
  ],
  controllers: apiControllers,
  providers: [InfluxService]
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .exclude(
        { path: "/api/worker/(.*)", method: RequestMethod.ALL },
        { path: "/api/view/(.*)", method: RequestMethod.ALL },
        { path: "/api/auth/login", method: RequestMethod.POST }
      )
      .forRoutes(...apiControllers);
  }
}
