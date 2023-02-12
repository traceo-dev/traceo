import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { CommentsGateway } from '@common/websockets/comments.gateway';
import { InfluxService } from '../providers/influx/influx.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { MemberController } from './member/member.controller';
import { MemberModule } from './member/member.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationModule } from './application/application.module';
import { DataSourceController } from './datasource/dataSource.controller';
import { DataSourceModule } from './datasource/dataSource.module';
import { IncidentCommentsController } from './incidents/incident-comments/incident-comments.controller';
import { IncidentsController } from './incidents/incidents.controller';
import { IncidentsModule } from './incidents/incidents.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { StatisticsController } from './statistics/statistics.controller';
import { StatisticsModule } from './statistics/statistics.module';
import { WorkerController } from './worker/worker.controller';
import { WorkerModule } from './worker/worker.module';
import { UsersController } from './user/users.controller';
import { ApplicationsController } from './application/applications.controller';
import { IncidentCommentsModule } from './incidents/incident-comments/incident-comments.module';

@Module({
    imports: [
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        UserModule,
        ApplicationModule,
        MemberModule,
        DataSourceModule,
        IncidentsModule,
        IncidentCommentsModule,
        StatisticsModule,
        WorkerModule,
        HttpModule,
        MetricsModule
    ],
    controllers: [
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
        MetricsController
    ],
    providers: [
        InfluxService,
        CommentsGateway
    ]
})
export class ApiModule { }
