import { Module } from "@nestjs/common";
import { KafkaModule } from "./kafka/kafka.module";
import { LiveService } from "./live.service";

@Module({
  imports: [KafkaModule],
  providers: [LiveService]
})
export class ServicesModule {}
