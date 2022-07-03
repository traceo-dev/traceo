import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        if (process.env.NODE_ENV === 'Local') {
            return {
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                database: 'traceo_local',
                password: 'postgres',
                entities: [join(__dirname, 'entities/*.entity.{js,ts}')],
                migrations: [join(__dirname, 'migrations/*.{js,ts}')],
                migrationsTransactionMode: 'each',
                migrationsRun: true,
                synchronize: true,
                logging: false,
            }
        } else if (process.env.NODE_ENV === 'Development') {
            return {
                type: 'postgres',
                host: process.env.AWS_S3_POSTGRES_HOST,
                port: +process.env.AWS_S3_POSTGRES_PORT,
                username: process.env.AWS_S3_POSTGRES_USER,
                database: process.env.AWS_S3_POSTGRES_DB_NAME,
                password: process.env.AWS_S3_POSTGRES_PASS,
                entities: [join(__dirname, 'entities/*.entity.{js,ts}')],
                migrations: [join(__dirname, 'migrations/*.{js,ts}')],
                migrationsTransactionMode: 'each',
                migrationsRun: true,
                synchronize: false,
                logging: false,
                // keepConnectionAlive: true,
                // ssl: {
                //     require: true,
                //     rejectUnauthorized: false,
                // },
            };
        } else if (process.env.NODE_ENV === 'Production') {
            return {}
        }
    }
}