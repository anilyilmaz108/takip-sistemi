import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string; // ADMIN, DOCTOR, PATIENT vs

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}