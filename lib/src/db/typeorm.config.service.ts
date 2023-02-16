import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { User } from './entities/user.entity';
import { Application } from './entities/application.entity';
import { Comment } from './entities/comment.entity';
import { Incident } from './entities/incident.entity';
import { Log } from './entities/log.entity';
import { Session } from './entities/session.entity';
import { InsertAdminUserOnStartup } from './migrations/InsertAdminUserOnStartup';
import { Datasource } from './entities/datasource.entity';
import { Metric } from './entities/metric.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

    const commonOptions: TypeOrmModuleOptions = {
      migrations: [InsertAdminUserOnStartup],
      migrationsTransactionMode: "each",
      migrationsRun: true,
      logging: false,
      autoLoadEntities: true,
      synchronize: false,
      // entities: [join(__dirname, "entities/*.entity.{js,ts}")]
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
        database: "traceo_sqlite_db",
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
}
