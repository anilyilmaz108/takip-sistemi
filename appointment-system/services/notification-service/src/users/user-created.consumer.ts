import { EventStoreService } from '../events/event-store.service';
import { BaseConsumer } from '../events/base.consumer';
import { KafkaService } from '../kafka/kafka.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCreatedConsumer extends BaseConsumer<any> {
  topic = 'user.created';

  constructor(
    kafka: KafkaService,
    private readonly eventStore: EventStoreService,
  ) {
    super(kafka);
  }

  async handle(event: any, correlationId: string): Promise<void> {
    const eventId = event.eventId;

    if (this.eventStore.isProcessed(eventId)) {
      this.logger.warn(
        `Duplicate event skipped | eventId=${eventId}`,
      );
      return;
    }

    this.logger.log(
      `Processing event | eventId=${eventId} | correlationId=${correlationId}`,
    );

    // Mail gönderme vs

    this.eventStore.markAsProcessed(eventId);
  }
}