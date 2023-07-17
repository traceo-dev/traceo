import { Injectable, Logger } from "@nestjs/common";
import { ConnectEvent, Consumer, Kafka, KafkaConfig, Message, Producer } from "kafkajs";

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  private readonly config: KafkaConfig;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(config: KafkaConfig) {
    this.config = config;

    this.kafka = new Kafka(this.config);
    this.consumer = this.kafka.consumer({ groupId: "traceo-kafka-group" });
    this.producer = this.kafka.producer();

    this.handleProducerEvents(this.producer);
    this.handleConsumerEvents(this.consumer);
  }

  public async connect() {
    await this.consumer.connect();
    await this.producer.connect();
  }

  public async disconnect() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  public async send(topic: string, messages: Message[]): Promise<void> {
    await this.producer.send({ topic, messages });
  }

  public async subscribe(topic: string, callback: (message: any) => void): Promise<void> {
    await this.consumer.subscribe({ topic });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        callback(JSON.parse(message.value.toString()));
      }
    });
  }

  private handleProducerEvents(producer: Producer) {
    producer.on("producer.connect", (event: ConnectEvent) => {
      this.logger.debug(`Producer ${event.id} connected to Kafka instance.`);
    });
  }

  private handleConsumerEvents(consumer: Consumer) {
    consumer.on("consumer.connect", (event: ConnectEvent) => {
      this.logger.debug(`Consumer ${event.id} connected to Kafka instance.`);
    });
  }
}
