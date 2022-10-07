import { DataSource } from 'typeorm';
import { join } from 'path';

let connectionSource;

if (!process.env.PG_HOST) {
    connectionSource = new DataSource({
        type: "sqlite",
        database: "traceo_sqlite_db",
        entities: [join(__dirname, "./lib/db/entities/*.entity.{js,ts}")],
    });
} else {
    connectionSource = new DataSource({
        type: "postgres",
        host: process.env.PG_HOST,
        port: +process.env.PG_PORT,
        username: process.env.PG_USER,
        database: process.env.PG_DB_NAME,
        password: process.env.PG_PASS,
        entities: [join(__dirname, "./lib/db/entities/*.entity.{js,ts}")],
        migrations: [join(__dirname, "./lib/db/migrations/*.{js,ts}")],
        migrationsTransactionMode: "each",
        migrationsRun: true,
        synchronize: true,
        logging: false
    });
}


export default connectionSource as DataSource;