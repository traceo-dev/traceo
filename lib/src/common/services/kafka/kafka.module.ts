import { Module, Global } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { KafkaConfig } from "kafkajs";

@Global()
@Module({
  providers: [
    {
      provide: KafkaService,
      useFactory: async () => {
        const kafkaConfig: KafkaConfig = {
          clientId: process.env.KAFKA_CLIENT_ID,
          brokers: process.env.KAFKA_HOSTS.split(",")
        };
        const kafkaService = new KafkaService(kafkaConfig);
        if (process.env.KAFKA_DISABLED !== "true") {
          await kafkaService.connect();
        }
        return kafkaService;
      }
    }
  ],
  exports: [KafkaService]
})
export class KafkaModule {}
