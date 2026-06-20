import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { DailyProgressService } from './daily-progress.service';
import { UpdateLogDto } from './dto/update-log.dto';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateResult } from 'typeorm';
import { DailyProgress } from './entities/daily-progress.entity';
import { ConsumptionLogService } from './consumption-log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { FoodsService } from '../foods/foods.service';
import { ConsumptionLog } from './entities/consumption-log.entity';
import { Food } from '../foods/entities/food.entity';
import { DailyProgressItemHateoasInterceptor } from './interceptors/daily-progress-item-hateoas.interceptor';
import { DailyProgressCollectionHateoasInterceptor } from './interceptors/daily-progress-collection-hateoas.interceptor';
import { DailyProgressDeleteHateoasInterceptor } from './interceptors/daily-progress-delete-hateoas.interceptor';
import type { HateoasMessage } from '../../types/hateoas.interface';
import { ConsumptionLogItemHateoasInterceptor } from './interceptors/consumption-log-item.interceptor';
import { ConsumptionLogDeleteHateoasInterceptor } from './interceptors/consumption-log-delete.interceptor';

@Controller('tracker')
export class TrackerController {
  constructor(
    private readonly dailyProgressService: DailyProgressService,
    private readonly consumptionLogService: ConsumptionLogService,
    private readonly foodService: FoodsService,
  ) {}

  @Get()
  getTrackerLinks(): HateoasMessage {
    return {
      message: 'Enlaces principales del tracker',
      _links: {
        dailyProgress: {
          href: '/tracker/daily-progress',
          method: 'GET',
        },
        consumptionLog: {
          href: '/tracker/consumption-log',
          method: 'GET',
        },
      },
    };
  }

  // Enlace para obtener los enlaces HATEOAS relacionados con daily-progress
  @Get('daily-progress')
  getDailyProgressLinks(): HateoasMessage {
    return {
      message: 'Enlaces disponibles para daily-progress',
      _links: {
        create: {
          href: '/tracker/daily-progress',
          method: 'POST',
        },
        findById: {
          href: '/tracker/daily-progress/{id}',
          method: 'GET',
        },
        findByProfile: {
          href: '/tracker/daily-progress/profile/{profileId}',
          method: 'GET',
        },
        update: {
          href: '/tracker/daily-progress/{id}',
          method: 'PATCH',
        },
        delete: {
          href: '/tracker/daily-progress/{id}',
          method: 'DELETE',
        },
        finalize: {
          href: '/tracker/daily-progress/{id}/finalize',
          method: 'PATCH',
        },
        skip: {
          href: '/tracker/daily-progress/{id}/skip',
          method: 'PATCH',
        },
        addConsumptionLog: {
          href: '/tracker/daily-progress/{id}/add-log',
          method: 'PATCH',
        },
        removeConsumptionLog: {
          href: '/tracker/daily-progress/{id}/remove-log',
          method: 'PATCH',
        },
        remove: {
          href: '/tracker/daily-progress/{id}',
          method: 'DELETE',
        },
      },
    };
  }

  // Enlace para obtener los enlaces HATEOAS relacionados con consumption-log
  @Get('consumption-log')
  getConsumptionLogLinks(): HateoasMessage {
    return {
      message: 'Enlaces disponibles para consumption-log',
      _links: {
        create: {
          href: '/tracker/consumption-log',
          method: 'POST',
        },
        findById: {
          href: '/tracker/consumption-log/{id}',
          method: 'GET',
        },
        update: {
          href: '/tracker/consumption-log/{id}',
          method: 'PATCH',
        },
        delete: {
          href: '/tracker/consumption-log/{id}',
          method: 'DELETE',
        },
      },
    };
  }

  @Post('daily-progress')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async createDaily(
    @Body() createDailyDto: CreateDailyDto,
  ): Promise<DailyProgress> {
    return this.dailyProgressService.create(createDailyDto);
  }

  @Get('daily-progress/:id')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async findOneDaily(@Param('id') id: string): Promise<DailyProgress> {
    return this.dailyProgressService.findOne(+id);
  }

  @Get('daily-progress/profile/:profileId')
  @UseInterceptors(DailyProgressCollectionHateoasInterceptor) // <--- Interceptor de Colección
  async findAllByProfile(
    @Param('profileId') profileId: string,
  ): Promise<DailyProgress[]> {
    return this.dailyProgressService.findAllByProfile(+profileId);
  }

  @Patch('daily-progress/:id')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async updateDaily(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
  ): Promise<UpdateResult> {
    return this.dailyProgressService.update(+id, updateLogDto);
  }

  @Patch('daily-progress/:id/finalize')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async toggleFinalizeDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleFinalizeDay(+id);
  }

  @Patch('daily-progress/:id/skip')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async toggleSkipDay(@Param('id') id: string): Promise<boolean> {
    return this.dailyProgressService.toggleSkipDay(+id);
  }

  @Patch('daily-progress/:id/add-log')
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
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
  @UseInterceptors(DailyProgressItemHateoasInterceptor) // <--- Interceptor Individual
  async removeLogFromDailyProgress(
    @Param('dailyProgressId') dailyProgressId: string,
    @Param('logId') consumptionLogId: string,
  ): Promise<DailyProgress> {
    const consumptionLog: ConsumptionLog =
      await this.consumptionLogService.findOne(+consumptionLogId);
    return this.dailyProgressService.removeLogFromDailyProgress(
      +dailyProgressId,
      consumptionLog,
    );
  }

  @Delete('daily-progress/:id')
  @UseInterceptors(DailyProgressDeleteHateoasInterceptor) // <--- Interceptor de Eliminación
  remove(@Param('id') id: string): Promise<DailyProgress> {
    return this.dailyProgressService.remove(+id);
  }

  @Post('consumption-log')
  @UseInterceptors(ConsumptionLogItemHateoasInterceptor) // <--- Interceptor Individual
  async createLog(@Body() createLogDto: CreateLogDto): Promise<ConsumptionLog> {
    const food: Food = await this.foodService.findOne(createLogDto.foodId);
    return this.consumptionLogService.create(createLogDto, food);
  }

  @Get('consumption-log/:id')
  @UseInterceptors(ConsumptionLogItemHateoasInterceptor) // <--- Interceptor Individual
  findOneLog(@Param('id') id: string): Promise<ConsumptionLog> {
    return this.consumptionLogService.findOne(+id);
  }

  @Patch('consumption-log/:id')
  @UseInterceptors(ConsumptionLogItemHateoasInterceptor) // <--- Interceptor Individual
  updateLog(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateLogDto,
  ): Promise<UpdateResult> {
    return this.consumptionLogService.update(+id, updateLogDto);
  }

  @Delete('consumption-log/:id')
  @UseInterceptors(ConsumptionLogDeleteHateoasInterceptor) // <--- Interceptor de Eliminación
  removeLog(@Param('id') id: string): Promise<ConsumptionLog> {
    return this.consumptionLogService.remove(+id);
  }
}
