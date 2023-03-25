import { Module, Global } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaConfig } from 'kafkajs';

@Global()
@Module({
    providers: [
        {
            provide: KafkaService,
            useFactory: async () => {
                const kafkaConfig: KafkaConfig = {
                    clientId: 'traceo-kafka',
                    brokers: ['localhost:29092'],
                };
                const kafkaService = new KafkaService(kafkaConfig);
                await kafkaService.connect();
                return kafkaService;
            },
        },
    ],
    exports: [KafkaService],
})
export class KafkaModule { }