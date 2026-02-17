import { OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

export abstract class BaseConsumer<T> implements OnModuleInit {
  abstract topic: string;
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly maxRetries = 3;

  constructor(protected readonly kafka: KafkaService) {}

  async onModuleInit() {
    await this.kafka.subscribe(this.topic, async ({ value, correlationId }) => {
      await this.processMessage(value, correlationId);
    });
  }

  private async processMessage(data: T, correlationId: string) {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        await this.handle(data, correlationId);
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Error processing message (attempt ${attempt}) | correlationId=${correlationId}`,
        );

        if (attempt >= this.maxRetries) {
          await this.sendToDLQ(data, correlationId, error);
        }
      }
    }
  }

  private async sendToDLQ(data: T, correlationId: string, error: any) {
    const dlqTopic = `${this.topic}.dlq`;

    this.logger.error(
      `Sending message to DLQ | topic=${dlqTopic} | correlationId=${correlationId}`,
    );

    await this.kafka.producerSend(dlqTopic, {
      value: {
        originalTopic: this.topic,
        data,
        error: error?.message,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'correlation-id': correlationId,
      },
    });
  }

  abstract handle(data: T, correlationId: string): Promise<void>;
}