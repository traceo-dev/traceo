import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'lib/auth/auth.module';
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
import { InfluxController } from './influx.controller';
import { StatisticsQueryService } from './statistics/query/statistics-query.service';
import { StatisticsController } from './statistics/statistics.controller';
import { StatisticsModule } from './statistics/statistics.module';
import { LogsService } from './worker/services/logs.service';
import { MetricsService } from './worker/services/metrics.service';
import { ProcessIncidentsService } from './worker/services/process-incidents.service';
import { RuntimeService } from './worker/services/runtime.service';
import { WorkerController } from './worker/worker.controller';
import { WorkerModule } from './worker/worker.module';

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
        HttpModule
    ],
    controllers: [
        InfluxController,
        AccountController,
        ApplicationController,
        AmrController,
        DataSourceController,
        IncidentCommentsController,
        IncidentsController,
        StatisticsController,
        WorkerController
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
        ProcessIncidentsService,
        LogsService,
        RuntimeService,
        MetricsService
    ]
})
export class ApiModule { }
