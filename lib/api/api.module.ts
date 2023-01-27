import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, UseGuards } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { GuardsModule } from '../common/guards/guards.module';
import { GuardsService } from '../common/guards/guards.service';
import { CommentsGateway } from '../common/websockets/comments.gateway';
import { InfluxService } from '../providers/influx/influx.service';
import { AccountQueryService } from './account/account-query/account-query.service';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { AmrQueryService } from './application-member/amr-query/amr-query.service';
import { AmrController } from './application-member/amr.controller';
import { AmrModule } from './application-member/amr.module';
import { AmrService } from './application-member/amr.service';
import { ApplicationQueryService } from './application/application-query/application-query.service';
import { ApplicationController } from './application/application.controller';
import { ApplicationModule } from './application/application.module';
import { ApplicationService } from './application/application.service';
import { DataSourceController } from './data-source/dataSource.controller';
import { DataSourceModule } from './data-source/dataSource.module';
import { DataSourceService } from './data-source/dataSource.service';
import { IncidentCommentsController } from './incidents/incident-comments/incident-comments.controller';
import { IncidentCommentsService } from './incidents/incident-comments/incident-comments.service';
import { IncidentCommentsQueryService } from './incidents/incident-comments/query/incident-comments-query.service';
import { IncidentsQueryService } from './incidents/incidents-query/incidents-query.service';
import { IncidentsController } from './incidents/incidents.controller';
import { IncidentsModule } from './incidents/incidents.module';
import { IncidentsService } from './incidents/incidents.service';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsService } from './metrics/metrics.service';
import { MetricsQueryService } from './metrics/query/metrics-query.service';
import { StatisticsQueryService } from './statistics/query/statistics-query.service';
import { StatisticsController } from './statistics/statistics.controller';
import { StatisticsModule } from './statistics/statistics.module';
import { WorkerLogsService } from './worker/services/worker-logs.service';
import { WorkerMetricsService } from './worker/services/worker-metrics.service';
import { WorkerIncidentsService } from './worker/services/worker-incidents.service';
import { WorkerRuntimeService } from './worker/services/worker-runtime.service';
import { WorkerController } from './worker/worker.controller';
import { WorkerModule } from './worker/worker.module';
import { AccountsController } from './account/accounts.controller';

/**
 * TODO: instead of import every service and controller, use only Modules in imports and
 * export every Controller and Service from him. Then remove controllers and providers arrays.
 */
@Module({
    imports: [
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AccountModule,
        ApplicationModule,
        AmrModule,
        DataSourceModule,
        IncidentsModule,
        StatisticsModule,
        WorkerModule,
        GuardsModule,
        HttpModule,
        MetricsModule
    ],
    controllers: [
        AccountController,
        AccountsController,
        ApplicationController,
        AmrController,
        DataSourceController,
        IncidentCommentsController,
        IncidentsController,
        StatisticsController,
        WorkerController,
        MetricsController
    ],
    providers: [
        InfluxService,
        GuardsService,
        AccountService,
        AccountQueryService,
        ApplicationService,
        ApplicationQueryService,
        AmrService,
        AmrQueryService,
        IncidentsService,
        IncidentsQueryService,
        IncidentCommentsService,
        IncidentCommentsQueryService,
        StatisticsQueryService,
        CommentsGateway,
        DataSourceService,
        WorkerIncidentsService,
        WorkerLogsService,
        WorkerRuntimeService,
        WorkerMetricsService,
        MetricsService,
        MetricsQueryService
    ]
})
export class ApiModule { }
