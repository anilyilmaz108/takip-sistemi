import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { UserCreatedPublisher } from 'src/common/events/user-created.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    KafkaModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserCreatedPublisher,
  ],
})
export class UserModule {}