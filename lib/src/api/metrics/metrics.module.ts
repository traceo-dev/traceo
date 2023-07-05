import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ClickhouseModule } from "../../common/services/clickhouse/clickhouse.module";
import { MetricsController } from "./metrics.controller";
import { MetricsQueryService } from "./query/metrics-query.service";
import { EventModule } from "../event/event.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    ClickhouseModule,
    EventModule
  ],
  providers: [MetricsQueryService,],
  controllers: [MetricsController],
  exports: [MetricsQueryService]
})
export class MetricsModule { }
