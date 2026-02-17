import { OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

export abstract class BaseConsumer<T> implements OnModuleInit {
  abstract topic: string;

  constructor(protected readonly kafka: KafkaService) {}

  async onModuleInit() {
    await this.kafka.subscribe(this.topic, async ({ value, correlationId }) => {
      await this.handle(value, correlationId);
    });
  }

  abstract handle(data: T, correlationId: string): Promise<void>;
}