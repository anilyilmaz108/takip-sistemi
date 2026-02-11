import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  keycloakId?: string; // KC ile mapping için

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}