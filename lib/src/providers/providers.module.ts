import { Module } from "@nestjs/common";
import { InfluxModule } from "./influx/influx.module";
import { InfluxService } from "./influx/influx.service";

@Module({
  imports: [InfluxModule],
  providers: [InfluxService]
})
export class ProvidersModule {}
