import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Role } from 'src/common/entities/role.entity';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST') || 'localhost',
      port: this.configService.get<number>('DB_PORT') || 5432,
      username: this.configService.get<string>('DB_USER') || 'appointment_user',
      password: this.configService.get<string>('DB_PASS') || 'appointment_pass',
      database: this.configService.get<string>('DB_NAME') || 'appointment',
      autoLoadEntities: true,
      synchronize: true, // dev için, prod’da false olmalı
      // logging: true,
      entities: [User, Role],
    };
  }
}
