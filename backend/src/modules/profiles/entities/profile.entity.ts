import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { DailyProgress } from '../../tracker/entities/daily-progress.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  pinCode: string;

  @ManyToOne(() => Account, (account) => account.profiles)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  accountId: number;

  @OneToMany(() => DailyProgress, (progress: DailyProgress) => progress.profile)
  dailyProgresses: DailyProgress[];
}
