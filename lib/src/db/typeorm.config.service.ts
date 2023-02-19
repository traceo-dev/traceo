import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { User } from './entities/user.entity';
import { Application } from './entities/application.entity';
import { Comment } from './entities/comment.entity';
import { Incident } from './entities/incident.entity';
import { Log } from './entities/log.entity';
import { Session } from './entities/session.entity';
import { StartupMigration } from './migrations/StartupMigration';
import { Datasource } from './entities/datasource.entity';
import { Metric } from './entities/metric.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

    const commonOptions: TypeOrmModuleOptions = {
      migrations: [StartupMigration],
      migrationsTransactionMode: "each",
      migrationsRun: true,
      logging: false,
      autoLoadEntities: true,
      synchronize: false,
      entities: [
        Application,
        Comment,
        Datasource,
        Incident,
        Log,
        Member,
        Metric,
        Session,
        User
      ]
    };

    if (!this.arePostgresConfigs) {
      Logger.warn("[Traceo] SqLite database connected. Please use own PostgresDB instance instead by passing envs.");
      return Object.assign(commonOptions, {
        type: "sqlite",
        database: `${this.sqliteStorage}/traceo-sqlite.db`,
      })
    } else {
      Logger.log("[Traceo] Postgres database connected successfully.");
      return Object.assign(commonOptions, {
        type: "postgres",
        host: process.env.PG_HOST,
        port: +process.env.PG_PORT,
        username: process.env.PG_USER,
        database: process.env.PG_DB_NAME,
        password: process.env.PG_PASS,
      });
    }
  }

  private get arePostgresConfigs() {
    return process.env.PG_HOST && process.env.PG_PORT &&
      process.env.PG_USER && process.env.PG_DB_NAME &&
      process.env.PG_PASS;
  }

  private get sqliteStorage() {
    switch (process.env.NODE_ENV) {
      case "production":
        //ubuntu
        return "/usr/traceo";
      default:
        //development
        return "../storage"
    }
  }
}
