import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { AccountMemberRelationship } from './entities/account-member-relationship.entity';
import { Account } from './entities/account.entity';
import { Application } from './entities/application.entity';
import { Comment } from './entities/comment.entity';
import { Incident } from './entities/incident.entity';
import { InfluxDS } from './entities/influxds.entity';
import { Log } from './entities/log.entity';
import { Runtime } from './entities/runtime.entity';
import { InsertAdminUserOnStartup } from './migrations/InsertAdminUserOnStartup';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

    if (!process.env.PG_HOST) {
      return {
        type: "sqlite",
        database: "traceo_sqlite_db",
        synchronize: true,
        entities: [
          Account,
          AccountMemberRelationship,
          Application,
          Comment,
          Incident,
          Log,
          Runtime,
          InfluxDS
        ],
        migrations: [InsertAdminUserOnStartup],
        migrationsTransactionMode: "each",
        migrationsRun: true,
        logging: false,
        autoLoadEntities: true
      }
    }

    return {
      type: "postgres",
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      database: process.env.PG_DB_NAME,
      password: process.env.PG_PASS,
      entities: [join(__dirname, "entities/*.entity.{js,ts}")],
      migrations: [InsertAdminUserOnStartup],
      migrationsTransactionMode: "each",
      migrationsRun: true,
      // synchronize: true,
      logging: false,
      autoLoadEntities: true
    };
  }
}
