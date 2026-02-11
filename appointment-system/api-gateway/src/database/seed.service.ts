import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/common/entities/role.entity';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    // 1️⃣ ADMIN rol var mı?
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      adminRole = this.roleRepository.create({
        name: 'ADMIN',
        description: 'System Administrator',
      });

      await this.roleRepository.save(adminRole);
      console.log('✅ ADMIN role created');
    }

    // 2️⃣ Admin user var mı?
    let adminUser = await this.userRepository.findOne({
      where: { email: 'admin@appointment.com' },
      relations: ['roles'],
    });

    if (!adminUser) {
      adminUser = this.userRepository.create({
        email: 'admin@appointment.com',
        firstName: 'System',
        lastName: 'Admin',
        roles: [adminRole],
      });

      await this.userRepository.save(adminUser);
      console.log('✅ Admin user created');
    }
  }
}