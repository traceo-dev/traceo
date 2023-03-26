import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ClickhouseModule } from "src/common/services/clickhouse/clickhouse.module";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { MetricsQueryService } from "./query/metrics-query.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ClickhouseModule
  ],
  providers: [
    MetricsService, 
    MetricsQueryService, 
  ],
  controllers: [
    MetricsController
  ],
  exports: [
    MetricsService, 
    MetricsQueryService
  ]
})
export class MetricsModule {}
