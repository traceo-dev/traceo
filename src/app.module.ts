import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WorkspaceModule } from './workspace/workspace.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { MailingModule } from './mailing/mailing.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/typeorm.config.service';
import { AttachmentsModule } from './attachments/attachments.module';
import { AwrModule } from './awr/awr.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CommentsModule } from './comments/comments.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { ReleaseModule } from './release/release.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    AccountModule,
    WorkspaceModule,
    MailingModule,
    AttachmentsModule,
    AwrModule,
    IncidentsModule,
    StatisticsModule,
    CommentsModule,
    WebsocketsModule,
    ReleaseModule,
    GithubModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
