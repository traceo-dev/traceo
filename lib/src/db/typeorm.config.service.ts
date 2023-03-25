import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Member } from "./entities/member.entity";
import { User } from "./entities/user.entity";
import { Application } from "./entities/application.entity";
import { Comment } from "./entities/comment.entity";
import { Incident } from "./entities/incident.entity";
import { Session } from "./entities/session.entity";
import { StartupMigration } from "./migrations/StartupMigration";
import { Datasource } from "./entities/datasource.entity";
import { Metric } from "./entities/metric.entity";
import { Event } from "./entities/event.entity";
import { ClickhouseMigration } from "./migrations/ClickhouseMigration";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      migrations: [
        StartupMigration,
        ClickhouseMigration
      ],
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
        Member,
        Metric,
        Session,
        User,
        Event
      ],
      type: "postgres",
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      database: process.env.PG_DB_NAME,
      password: process.env.PG_PASS
    };
  }
}
