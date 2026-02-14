import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}