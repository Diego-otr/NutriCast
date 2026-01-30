// src/modules/accounts/entities/account.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Food } from '../../foods/entities/food.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Por seguridad, no trae la contraseña en consultas comunes
  password: string;

  @OneToMany(() => Profile, (profile) => profile.account)
  profiles: Profile[];

  @OneToMany(() => Food, (food) => food.account)
  foods: Food[];

  @CreateDateColumn()
  createdAt: Date;
}
