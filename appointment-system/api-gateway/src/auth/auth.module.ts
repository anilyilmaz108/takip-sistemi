import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Role } from 'src/common/entities/role.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}