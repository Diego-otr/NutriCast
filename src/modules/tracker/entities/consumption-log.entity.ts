import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { DailyProgress } from './daily-progress.entity';
import { Food } from '../../foods/entities/food.entity';

@Entity('consumption_logs')
export class ConsumptionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountGrams: number;

  @Column()
  portions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  calculatedCalories: number;

  @ManyToOne(() => DailyProgress, (progress) => progress.logs)
  @JoinColumn({ name: 'daily_progress_id' })
  dailyProgress: DailyProgress;

  @Column()
  dailyProgressId: number;

  @ManyToOne(() => Food, (food) => food.logs)
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column()
  foodId: number;

  @CreateDateColumn()
  createdAt: Date;
}
