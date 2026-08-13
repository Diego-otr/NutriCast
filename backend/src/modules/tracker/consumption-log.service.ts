import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Food } from '../foods/entities/food.entity';

@Injectable()
export class ConsumptionLogService {
  constructor(
    @InjectRepository(ConsumptionLog)
    private readonly consumptionLogRepository: Repository<ConsumptionLog>,
  ) {}

  async create(
    createLogDto: CreateLogDto,
    food: Food,
  ): Promise<ConsumptionLog> {
    const consumptionLog = new ConsumptionLog();

    consumptionLog.calculatedCalories = this.calculateCalories(
      createLogDto,
      food,
      createLogDto.perPortions,
    );
    consumptionLog.amountGrams = createLogDto.amountGrams || 0;
    consumptionLog.portions = createLogDto.portions || 0;
    consumptionLog.dailyProgressId = createLogDto.profileId;
    consumptionLog.foodId = food.id;
    consumptionLog.createdAt = new Date();

    return await this.consumptionLogRepository.save(consumptionLog);
  }

  async findOne(id: number): Promise<ConsumptionLog> {
    const consumptionLog: ConsumptionLog | null =
      await this.consumptionLogRepository.findOne({ where: { id } });
    if (!consumptionLog) {
      throw new NotFoundException(`ConsumptionLog with ID ${id} not found`);
    }
    return consumptionLog;
  }

  async update(id: number, updateLogDto: UpdateLogDto): Promise<UpdateResult> {
    const consumptionLog: ConsumptionLog = await this.findOne(id);
    consumptionLog.calculatedCalories = this.calculateCalories(
      updateLogDto as CreateLogDto,
      consumptionLog.food,
      updateLogDto.perPortions,
    );
    consumptionLog.amountGrams = updateLogDto.amountGrams || 0;
    consumptionLog.portions = updateLogDto.portions || 0;
    consumptionLog.createdAt = new Date();
    return this.consumptionLogRepository.update(id, updateLogDto);
  }

  private calculateCalories(
    dto: CreateLogDto,
    food: Food,
    perPortions: boolean,
  ): number {
    if (perPortions) {
      return dto.portions! * food.caloriesPerPortion;
    } else {
      return dto.amountGrams! * food.caloriesPerGram;
    }
  }

  async remove(id: number): Promise<ConsumptionLog> {
    const consumptionLog = await this.findOne(id);
    return await this.consumptionLogRepository.remove(consumptionLog);
  }
}
