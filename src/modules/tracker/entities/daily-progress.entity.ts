import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { ConsumptionLog } from './consumption-log.entity';
import { DEFAULT_TARGET_CALORIES } from '../tracker.constants';

@Entity('daily_progress')
export class DailyProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  referenceDate: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: DEFAULT_TARGET_CALORIES,
  })
  targetCal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCaloriesSum: number;

  @Column({ default: false })
  isFinalized: boolean;

  @Column({ default: false })
  isSkiped: boolean;

  @ManyToOne(() => Profile, (profile: Profile) => profile.dailyProgresses)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column()
  profileId: number;

  @OneToMany(() => ConsumptionLog, (log) => log.dailyProgress)
  logs: ConsumptionLog[];
}
