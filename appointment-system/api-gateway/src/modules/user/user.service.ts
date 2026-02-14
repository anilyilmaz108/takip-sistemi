import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/common/redis/redis.service';
import { RedisKeys } from 'src/common/redis/redis-keys.helper';
import { User } from 'src/common/entities/user.entity';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { Role } from 'src/common/entities/role.entity';
import { In } from 'typeorm';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';
import { UserResponseDto } from 'src/common/dtos/user-response.dto';

@Injectable()
export class UserService {
  private readonly ttl: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    this.ttl = this.configService.get<number>('CACHE_TTL', 60);
  }

async findOne(id: string) {
  const cacheKey = RedisKeys.user.byId(id);

  const cached = await this.redisService.get<UserResponseDto>(cacheKey);
  if (cached) return cached;

  const user = await this.userRepository.findOne({
    where: { id, deletedAt: IsNull() },
    relations: ['roles'],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const dto = this.mapToResponseDto(user);

  await this.redisService.set(cacheKey, dto, this.ttl);

  return dto;
}

async findAll() {
  const cacheKey = RedisKeys.user.all();

  const cached = await this.redisService.get<UserResponseDto[]>(cacheKey);
  if (cached) return cached;

  const users = await this.userRepository.find({
    where: { deletedAt: IsNull() },
    relations: ['roles'],
  });

  const dto = users.map((u) => this.mapToResponseDto(u));

  await this.redisService.set(cacheKey, dto, this.ttl);

  return dto;
}

async create(createUserDto: CreateUserDto) {
  const { roleIds, ...userData } = createUserDto;

  const existing = await this.userRepository.findOne({
    where: { email: userData.email },
  });

  if (existing) {
    throw new ConflictException('Email already exists');
  }

  const user = this.userRepository.create(userData);

  if (roleIds?.length) {
    const roles = await this.roleRepository.findBy({
      id: In(roleIds),
    });
    user.roles = roles;
  }

  const savedUser = await this.userRepository.save(user);

  await this.redisService.del(RedisKeys.user.all());

  return this.mapToResponseDto(savedUser);
}

 async update(id: string, updateDto: UpdateUserDto) {
  const user = await this.userRepository.findOne({
    where: { id, deletedAt: IsNull() },
    relations: ['roles'],
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const { roleIds, ...userData } = updateDto;

  Object.assign(user, userData);

  if (roleIds) {
    const roles = await this.roleRepository.findBy({
      id: In(roleIds),
    });
    user.roles = roles;
  }

  const updated = await this.userRepository.save(user);

  await this.redisService.del([
    RedisKeys.user.byId(id),
    RedisKeys.user.all(),
  ]);

  return this.mapToResponseDto(updated);
}

  async remove(id: string) {
    await this.userRepository.softDelete(id);

    await this.redisService.del([
      RedisKeys.user.byId(id),
      RedisKeys.user.all(),
    ]);

    return { message: 'User deleted' };
  }

  async restore(id: string) {
    await this.userRepository.restore(id);

    await this.redisService.del([
      RedisKeys.user.byId(id),
      RedisKeys.user.all(),
    ]);

    return { message: 'User restored' };
  }

  async deactivate(id: string) {
  const user = await this.userRepository.findOne({
    where: { id, deletedAt: IsNull() },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.isActive = false;

  const updated = await this.userRepository.save(user);

  await this.redisService.del([
    RedisKeys.user.byId(id),
    RedisKeys.user.all(),
  ]);

  return this.mapToResponseDto(updated);
}


  private mapToResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    roles: user.roles?.map((r) => r.name) ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
}