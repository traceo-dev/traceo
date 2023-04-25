import { MigrationInterface, QueryRunner } from "typeorm";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { Logger } from "@nestjs/common";
import { CREATE_BROWSER_PERFS_TABLE, CREATE_DATABASE, CREATE_LOGS_TABLE, CREATE_METRICS_TABLE, CREATE_NOTIFICATIONS_TABLE } from "src/common/services/clickhouse/queries";

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
            password: process.env.CLICKHOUSE_PASSWORD
        })
    }

    async up(_queryRunner: QueryRunner): Promise<any> {
        try {

            // Create table if not exists
            await this.clickhouseClient.query({
                query: CREATE_DATABASE
            });

            // Log table
            await this.clickhouseClient.query({
                query: CREATE_LOGS_TABLE
            });

            // Metrics table
            await this.clickhouseClient.query({
                query: CREATE_METRICS_TABLE
            });

            // Browser perfs table
            await this.clickhouseClient.query({
                query: CREATE_BROWSER_PERFS_TABLE
            });

            // User notifications table
            await this.clickhouseClient.query({
                query: CREATE_NOTIFICATIONS_TABLE
            })

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
