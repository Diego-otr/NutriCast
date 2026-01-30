import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { DailyProgress } from './entities/daily-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConsumptionLog]),
    TypeOrmModule.forFeature([DailyProgress]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
