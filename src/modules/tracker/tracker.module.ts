import { Module } from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { DailyProgressController } from './daily-progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { DailyProgress } from './entities/daily-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumptionLog]),
    TypeOrmModule.forFeature([DailyProgress]),
  ],
  controllers: [DailyProgressController],
  providers: [DailyProgressService],
})
export class TrackerModule {}
