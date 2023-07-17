import { Module, Global } from "@nestjs/common";
import { ClickhouseService } from "./clickhouse.service";
import { ClickHouseClientConfigOptions } from "@clickhouse/client";

@Global()
@Module({
  providers: [
    {
      provide: ClickhouseService,
      useFactory: async () => {
        const configs: ClickHouseClientConfigOptions = {
          host: process.env.CLICKHOUSE_HOST,
          username: process.env.CLICKHOUSE_USER,
          password: process.env.CLICKHOUSE_PASSWORD,
          database: `traceo_${process.env.NODE_ENV}`
        };
        const clickhouse = new ClickhouseService(configs);
        await clickhouse.connect();

        return clickhouse;
      }
    }
  ],
  exports: [ClickhouseService]
})
export class ClickhouseModule {}
