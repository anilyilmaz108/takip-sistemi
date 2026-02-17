import { Injectable } from '@nestjs/common';
import { BaseEventPublisher } from './base-event.publisher';
import { KafkaService } from '../kafka/kafka.service';
import { UserCreatedEventData } from './user-created-event-data';

@Injectable()
export class UserCreatedPublisher extends BaseEventPublisher<UserCreatedEventData> {
  topic = 'user.created';
  eventName = 'UserCreated';

  constructor(kafka: KafkaService) {
    super(kafka);
  }
}