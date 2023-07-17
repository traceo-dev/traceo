import { Module } from "@nestjs/common";
import { ClickhouseModule } from "../../common/services/clickhouse/clickhouse.module";
import { PerformanceController } from "./performance.controller";
import { PerformanceService } from "./performance.service";

@Module({
  imports: [ClickhouseModule],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService]
})
export class PerformanceModule {}
