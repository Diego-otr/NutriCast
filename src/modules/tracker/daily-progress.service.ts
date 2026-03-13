import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { DailyProgress } from './entities/daily-progress.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class DailyProgressService {
  constructor(
    @InjectRepository(DailyProgress)
    private readonly dailyProgressRepository: Repository<DailyProgress>,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<DailyProgress> {
    const dailyProgress: DailyProgress =
      this.dailyProgressRepository.create(createLogDto);
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

  async update(id: number, updateLogDto: UpdateLogDto): Promise<DailyProgress> {
    await this.findOne(id);
    await this.dailyProgressRepository.update(id, updateLogDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(id);
    return await this.dailyProgressRepository.remove(dailyProgress);
  }
}
