import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { ConsumptionLog } from '../../tracking/entities/consumption-log.entity';
@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  caloriesPerGram: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  caloriesPerPortion: number;

  // Relación con la cuenta (Shared Library)
  // Muchos alimentos pertenecen a una sola cuenta
  @ManyToOne(() => Account, (account: Account) => account.foods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  accountId: number;

  // Relación con los registros de consumo (Para historial y promedios)
  @OneToMany(() => ConsumptionLog, (log: ConsumptionLog) => log.food)
  logs: ConsumptionLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
