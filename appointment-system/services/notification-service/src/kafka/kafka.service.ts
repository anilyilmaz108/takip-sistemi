import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);

  private kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
  });

  private consumer: Consumer;
  private producer: Producer;

  async onModuleInit() {
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID ?? 'notification-service-group',
    });

    await this.consumer.connect();
    this.logger.log('Kafka consumer connected');

    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async subscribe(topic: string, handler: (payload: any) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        const rawValue = message.value.toString();
        const headers = message.headers || {};

        const correlationId =
          headers['correlation-id']?.toString() ?? 'unknown';

        await handler({
          value: JSON.parse(rawValue),
          correlationId,
        });
      },
    });
  }

  async producerSend(topic: string, message: any) {
  await this.producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(message.value),
        headers: message.headers,
      },
    ],
  });
}

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }
}