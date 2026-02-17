import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    clientId: 'user-service',
    brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
  });

  private producer: Producer;

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(
    topic: string,
    message: {
      key?: string;
      value: any;
      headers?: Record<string, string>;
    },
  ) {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.key,
          value: JSON.stringify(message.value),
          headers: message.headers,
        },
      ],
    });
  }
}