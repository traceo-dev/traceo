import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { GuardsModule } from '../common/guards/guards.module';
import { CommentsGateway } from '../common/websockets/comments.gateway';
import { InfluxService } from '../providers/influx/influx.service';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AmrController } from './application-member/amr.controller';
import { AmrModule } from './application-member/amr.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationModule } from './application/application.module';
import { DataSourceController } from './data-source/dataSource.controller';
import { DataSourceModule } from './data-source/dataSource.module';
import { IncidentCommentsController } from './incidents/incident-comments/incident-comments.controller';
import { IncidentsController } from './incidents/incidents.controller';
import { IncidentsModule } from './incidents/incidents.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { StatisticsController } from './statistics/statistics.controller';
import { StatisticsModule } from './statistics/statistics.module';
import { WorkerController } from './worker/worker.controller';
import { WorkerModule } from './worker/worker.module';
import { AccountsController } from './account/accounts.controller';
import { ApplicationsController } from './application/applications.controller';
import { IncidentCommentsModule } from './incidents/incident-comments/incident-comments.module';

@Module({
    imports: [
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        AccountModule,
        ApplicationModule,
        AmrModule,
        DataSourceModule,
        IncidentsModule,
        IncidentCommentsModule,
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
        ApplicationsController,
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
        CommentsGateway
    ]
})
export class ApiModule { }
