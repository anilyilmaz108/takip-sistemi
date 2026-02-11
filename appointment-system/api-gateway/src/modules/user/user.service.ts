import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async update(id: string, data: Partial<User>) {
    await this.userRepository.update(id, data);
    return this.findOne(id);
  }

  async deactivate(id: string) {
    await this.userRepository.update(id, { isActive: false });
  }

  async softDelete(id: string) {
    await this.userRepository.softDelete(id);
  }
}