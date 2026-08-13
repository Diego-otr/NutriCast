import { Injectable, NotFoundException } from '@nestjs/common';
import { DailyProgress } from './entities/daily-progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { Repository, UpdateResult } from 'typeorm';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { DEFAULT_TARGET_CALORIES } from './tracker.constants';

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
      await this.dailyProgressRepository.findOne({
        where: { id },
        relations: ['logs', 'logs.food'],
      });
    if (!dailyProgress) {
      throw new NotFoundException(`DailyProgress with ID ${id} not found`);
    }
    return dailyProgress;
  }

  async findAllByProfile(profileId: number): Promise<DailyProgress[]> {
    return await this.dailyProgressRepository.find({
      where: { profileId },
      relations: ['logs', 'logs.food'],
      order: { referenceDate: 'DESC' },
    });
  }

  /**
   * Obtiene el DailyProgress actualmente activo (no finalizado ni omitido) para un perfil.
   * Si no existe ninguno activo, genera uno nuevo automáticamente para hoy.
   */
  async findActiveByProfile(profileId: number): Promise<DailyProgress> {
    let active = await this.dailyProgressRepository.findOne({
      where: { profileId, isFinalized: false, isSkiped: false },
      relations: ['logs', 'logs.food'],
      order: { referenceDate: 'DESC', id: 'DESC' },
    });

    if (!active) {
      const lastProgress = await this.dailyProgressRepository.findOne({
        where: { profileId },
        order: { referenceDate: 'DESC', id: 'DESC' },
      });

      active = await this.createNextDefaultProgress({
        profileId,
        targetCal: lastProgress?.targetCal
          ? Number(lastProgress.targetCal)
          : DEFAULT_TARGET_CALORIES,
      } as DailyProgress);
    }

    return active;
  }

  async update(
    id: number,
    updateDailyDto: UpdateDailyDto,
  ): Promise<UpdateResult> {
    return await this.dailyProgressRepository.update(id, updateDailyDto);
  }

  /**
   * Finaliza el día actual y genera el siguiente DailyProgress por defecto
   */
  async toggleFinalizeDay(id: number): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(id);
    dailyProgress.isFinalized = !dailyProgress.isFinalized;
    await this.dailyProgressRepository.save(dailyProgress);

    if (dailyProgress.isFinalized) {
      return await this.createNextDefaultProgress(dailyProgress);
    }

    return dailyProgress;
  }

  /**
   * Omite el día actual y genera el siguiente DailyProgress por defecto
   */
  async toggleSkipDay(id: number): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(id);
    dailyProgress.isSkiped = !dailyProgress.isSkiped;
    await this.dailyProgressRepository.save(dailyProgress);

    if (dailyProgress.isSkiped) {
      return await this.createNextDefaultProgress(dailyProgress);
    }

    return dailyProgress;
  }

  /**
   * Método privado auxiliar para crear un nuevo registro de progreso diario por defecto
   * heredando la meta de calorías (targetCal) y el perfil (profileId) del día anterior.
   */
  private async createNextDefaultProgress(
    previousProgress: DailyProgress,
  ): Promise<DailyProgress> {
    const todayString = new Date().toISOString().split('T')[0];
    const newDailyProgress = this.dailyProgressRepository.create({
      profileId: previousProgress.profileId,
      targetCal: previousProgress.targetCal || DEFAULT_TARGET_CALORIES,
      referenceDate: todayString,
      totalCaloriesSum: 0,
      isFinalized: false,
      isSkiped: false,
      logs: [],
    });
    return await this.dailyProgressRepository.save(newDailyProgress);
  }

  async addLogToDailyProgress(
    dailyProgressId: number,
    consumptionLog: ConsumptionLog,
  ): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(dailyProgressId);
    if (!dailyProgress.logs) {
      dailyProgress.logs = [];
    }
    dailyProgress.logs.push(consumptionLog);
    dailyProgress.totalCaloriesSum =
      Number(dailyProgress.totalCaloriesSum || 0) +
      Number(consumptionLog.calculatedCalories || 0);
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress;
  }

  async removeLogFromDailyProgress(
    dailyProgressId: number,
    consumptionLog: ConsumptionLog,
  ): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(dailyProgressId);
    if (dailyProgress.logs) {
      dailyProgress.logs = dailyProgress.logs.filter(
        (log) => log.id !== consumptionLog.id,
      );
    }
    dailyProgress.totalCaloriesSum = Math.max(
      0,
      Number(dailyProgress.totalCaloriesSum || 0) -
        Number(consumptionLog.calculatedCalories || 0),
    );
    await this.dailyProgressRepository.save(dailyProgress);
    return dailyProgress;
  }

  async remove(id: number): Promise<DailyProgress> {
    const dailyProgress = await this.findOne(id);
    return await this.dailyProgressRepository.remove(dailyProgress);
  }
}
