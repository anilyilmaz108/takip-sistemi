import { Injectable, Logger } from '@nestjs/common';
import { BaseConsumer } from '../events/base.consumer';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class UserCreatedConsumer extends BaseConsumer<any> {
  topic = 'user.created';

  private readonly logger = new Logger(UserCreatedConsumer.name);

  constructor(kafka: KafkaService) {
    super(kafka);
  }

  async handle(event: any, correlationId: string): Promise<void> {
    this.logger.log(
      `UserCreated event received | correlationId=${correlationId}`,
    );

    this.logger.log(JSON.stringify(event));

    // Burada mail gönderme vs yapılabilir
  }
}