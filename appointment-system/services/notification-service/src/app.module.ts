import { Module } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { UserCreatedConsumer } from './users/user-created.consumer';
import { EventStoreService } from './events/event-store.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KafkaService, EventStoreService, UserCreatedConsumer],
})
export class AppModule {}