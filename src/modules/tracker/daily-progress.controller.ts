import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { UpdateLogDto } from './dto/update-log.dto';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateResult } from 'typeorm';
import { DailyProgress } from './entities/daily-progress.entity';
import { ConsumptionLogService } from './consumption-log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { FoodsService } from '../foods/foods.service';

@Controller('tracker')
export class Tracker {
  constructor(
    private readonly dailyProgressService: DailyProgressService,
    private readonly consumptionLogService: ConsumptionLogService,
    private readonly foodService: FoodsService,
  ) {}

  @Post('daily-progress')
  create(@Body() createDailyDto: CreateDailyDto): Promise<DailyProgress> {
    return this.dailyProgressService.create(createDailyDto);
  }

  @Get('daily-progress/:id')
  findOne(@Param('id') id: string): Promise<DailyProgress> {
    return this.dailyProgressService.findOne(+id);
  }

  @Patch('daily-progress/:id')
  update(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
  ): Promise<UpdateResult> {
    return this.dailyProgressService.update(+id, updateLogDto);
  }

  @Patch('daily-progress/:id/finalize')
  toggleFinalizeDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleFinalizeDay(+id);
  }

  @Patch('daily-progress/:id/skip')
  toggleSkipDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleSkipDay(+id);
  }

  @Patch('daily-progress/:id/add-log')
  async addLogToDailyProgress(
    @Param('id') id: string,
    @Body() createLogDto: CreateLogDto,
  ): Promise<DailyProgress> {
    const food = await this.foodService.findOne(createLogDto.foodId);
    const consumptionLog = await this.consumptionLogService.create(
      createLogDto,
      food,
    );
    return this.dailyProgressService.addLogToDailyProgress(+id, consumptionLog);
  }

  @Delete('daily-progress/:dailyProgressId/remove-log/:logId')
  async removeLogFromDailyProgress(
    @Param('dailyProgressId') dailyProgressId: string,
    @Param('logId') consumptionLogId: string,
  ): Promise<DailyProgress> {
    const consumptionLog =
      await this.consumptionLogService.findOne(+consumptionLogId);
    return this.dailyProgressService.removeLogFromDailyProgress(
      +dailyProgressId,
      consumptionLog,
    );
  }

  @Delete('daily-progress/:id')
  remove(@Param('id') id: string): Promise<DailyProgress> {
    return this.dailyProgressService.remove(+id);
  }
}
