import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/typeorm.config.service';
import { AmrModule } from './application-member/amr.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CommentsModule } from './comments/comments.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { DataSourceModule } from './dataSource/dataSource.module';
import { WorkerModule } from './worker/worker.module';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "development" ? '.env.development' : ""
    }),
    ScheduleModule.forRoot(),
    AccountModule,
    ApplicationModule,
    AmrModule,
    IncidentsModule,
    StatisticsModule,
    CommentsModule,
    WebsocketsModule,
    DataSourceModule,
    WorkerModule,
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', "..", 'app'),
      serveStaticOptions: {
        cacheControl: true
      }
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
