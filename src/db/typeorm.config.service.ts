import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            url:
                process.env.NODE_ENV === 'DEV'
                    ? process.env.HEROKU_POSTGRESQL_URL
                    : process.env.DATABASE_URL,
            entities: [join(__dirname, 'entities/*.entity.{js,ts}')],
            migrations: [join(__dirname, 'migrations/*.{js,ts}')],
            subscribers: [],
            migrationsTransactionMode: 'each',
            migrationsRun: true,
            synchronize: true,
            keepConnectionAlive: true,
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
    }
}