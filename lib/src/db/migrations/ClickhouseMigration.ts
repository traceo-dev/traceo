import { MigrationInterface, QueryRunner } from "typeorm";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { Logger } from "@nestjs/common";

export class ClickhouseMigration implements MigrationInterface {
    name?: string;

    private clickhouseClient: ClickHouseClient;
    private logger: Logger;

    constructor() {
        this.name = `ClickhouseMigration${Date.now()}`;
        this.logger = new Logger(ClickhouseMigration.name);
        this.clickhouseClient = createClient({
            host: process.env.CLICKHOUSE_HOST,
            username: process.env.CLICKHOUSE_USER,
            password: process.env.CLICKHOUSE_PASSWORD,
            clickhouse_settings: {
                allow_experimental_object_type: 1
            }
        })
    }

    async up(_queryRunner: QueryRunner): Promise<any> {
        try {
            // Create traceo database if it does not exist
            const db_name = `${process.env.CLICKHOUSE_DATABASE}_${process.env.NODE_ENV}`;

            await this.clickhouseClient.query({
                query: `CREATE DATABASE IF NOT EXISTS ${db_name}`
            });

            // Create log table if it does not exist
            await this.clickhouseClient.query({
                query: `
                    CREATE TABLE IF NOT EXISTS ${db_name}.logs (
                        id UUID,
                        message String,
                        timestamp String,
                        precise_timestamp UInt128,
                        receive_timestamp UInt128,
                        level String,
                        application_id String,
                        resources String
                    ) 
                    ENGINE = MergeTree() 
                    ORDER BY id
                `});

            this.logger.log(`[Traceo] Clickhouse migration end with success.`)
        } catch (err) {
            this.logger.error(`[Traceo] Cannot run clickhouse migration. Caused by: ${err}`);
        } finally {
            await this.clickhouseClient.close();
        }
    }

    async down(_queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
