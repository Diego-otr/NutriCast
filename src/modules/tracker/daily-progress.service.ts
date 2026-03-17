import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { DailyProgress } from './entities/daily-progress.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { UpdateResult } from 'typeorm';
import { ConsumptionLog } from './entities/consumption-log.entity';

@Injectable()
export class DailyProgressService {
  constructor(
    @InjectRepository(DailyProgress)
    private readonly dailyProgressRepository: Repository<DailyProgress>,
  ) {}

  async create(createDailyDto: CreateDailyDto): Promise<DailyProgress> {
    const dailyProgress: DailyProgress =
      this.dailyProgressRepository.create(createDailyDto);
    return await this.dailyProgressRepository.save(dailyProgress);
  }

  async findOne(id: number): Promise<DailyProgress> {
    const dailyProgress: DailyProgress | null =
      await this.dailyProgressRepository.findOne({ where: { id } });
    if (!dailyProgress) {
      throw new NotFoundException(`DailyProgress with ID ${id} not found`);
    }
    return dailyProgress;
  }

  async update(
    id: number,
    updateDailyDto: UpdateDailyDto,
  ): Promise<UpdateResult> {
    return await this.dailyProgressRepository.update(id, updateDailyDto);
  }

  async toggleFinalizeDay(id: number): Promise<boolean> {
    const dailyProgress = await this.findOne(id);
    dailyProgress.isFinalized = !dailyProgress.isFinalized;
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress.isFinalized;
  }

  async toggleSkipDay(id: number): Promise<boolean> {
    const dailyProgress = await this.findOne(id);
    dailyProgress.isSkiped = !dailyProgress.isSkiped;
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress.isSkiped;
  }

  async addLogToDailyProgress(
    dailyProgressId: number,
    consumptionLog: ConsumptionLog,
  ): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(dailyProgressId);
    dailyProgress.logs.push(consumptionLog);
    dailyProgress.totalCaloriesSum += consumptionLog.calculatedCalories;
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress;
  }

  async removeLogFromDailyProgress(
    dailyProgressId: number,
    consumptionLog: ConsumptionLog,
  ): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(dailyProgressId);
    dailyProgress.logs = dailyProgress.logs.filter(
      (log) => log.id !== consumptionLog.id,
    );
    dailyProgress.totalCaloriesSum -= consumptionLog.calculatedCalories;
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress;
  }

  async remove(id: number): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(id);
    return await this.dailyProgressRepository.remove(dailyProgress);
  }
}
