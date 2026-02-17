import { KafkaService } from '../kafka/kafka.service';

export interface BaseEvent<T> {
  eventName: string;
  version: number;
  data: T;
}

export abstract class BaseEventPublisher<T> {
  abstract topic: string;
  abstract eventName: string;
  protected version = 1;

  constructor(protected readonly kafka: KafkaService) {}

  async publish(data: T, correlationId: string) {
    await this.kafka.send(this.topic, {
      key: correlationId,
      value: {
        eventName: this.eventName,
        version: this.version,
        data,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'correlation-id': correlationId,
        'event-name': this.eventName,
      },
    });
  }
}