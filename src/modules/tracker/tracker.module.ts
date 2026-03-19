import { Module } from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { TrackerController } from './tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { DailyProgress } from './entities/daily-progress.entity';
import { ConsumptionLogService } from './consumption-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumptionLog]),
    TypeOrmModule.forFeature([DailyProgress]),
  ],
  controllers: [TrackerController],
  providers: [DailyProgressService, ConsumptionLogService],
})
export class TrackerModule {}
