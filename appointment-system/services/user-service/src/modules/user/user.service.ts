import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreatedPublisher } from 'src/common/events/user-created.publisher';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly userCreatedPublisher: UserCreatedPublisher,
  ) {}

  async create(dto: CreateUserDto, correlationId: string) {
    const user = this.repo.create(dto);
    const savedUser = await this.repo.save(user);

    await this.userCreatedPublisher.publish(
      {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      },
      correlationId,
    );

    return savedUser;
  }
}