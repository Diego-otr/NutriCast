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
import { UpdateResult } from 'typeorm/browser/query-builder/result/UpdateResult.js';
import { DailyProgress } from './entities/daily-progress.entity';
import { ConsumptionLog } from './entities/consumption-log.entity';

@Controller('daily-progress')
export class DailyProgressController {
  constructor(private readonly dailyProgressService: DailyProgressService) {}

  @Post()
  create(@Body() createDailyDto: CreateDailyDto): Promise<DailyProgress> {
    return this.dailyProgressService.create(createDailyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DailyProgress> {
    return this.dailyProgressService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
  ): Promise<UpdateResult> {
    return this.dailyProgressService.update(+id, updateLogDto);
  }

  @Patch(':id/finalize')
  toggleFinalizeDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleFinalizeDay(+id);
  }

  @Patch(':id/skip')
  toggleSkipDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleSkipDay(+id);
  }

  @Patch(':id/add-log')
  addLogToDailyProgress(
    @Param('id') id: string,
    @Body() consumptionLog: ConsumptionLog,
  ): Promise<DailyProgress> {
    //REVISAR COMO OBTENER CONSUMPTIONLOG DESDE EL FRONT, SI SE ENVIA EL OBJETO COMPLETO O SOLO EL ID Y SE BUSCA EN EL BACK
    return this.dailyProgressService.addLogToDailyProgress(+id, consumptionLog);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<CreateDailyDto> {
    return this.dailyProgressService.remove(+id);
  }
}
