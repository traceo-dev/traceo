import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ClickhouseModule } from "../../common/services/clickhouse/clickhouse.module";
import { MetricsController } from "./metrics.controller";
import { MetricsQueryService } from "./query/metrics-query.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ClickhouseModule
  ],
  providers: [MetricsQueryService,],
  controllers: [MetricsController],
  exports: [MetricsQueryService]
})
export class MetricsModule { }
