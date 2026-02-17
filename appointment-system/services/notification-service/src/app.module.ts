import { Module } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { UserCreatedConsumer } from './users/user-created.consumer';

@Module({
  imports: [],
  controllers: [],
  providers: [
    KafkaService,
    UserCreatedConsumer,
  ],
})
export class AppModule {}