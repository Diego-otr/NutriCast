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
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';

@Controller('daily-progress')
export class DailyProgressController {
  constructor(private readonly dailyProgressService: DailyProgressService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto) {
    return this.dailyProgressService.create(createLogDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyProgressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.dailyProgressService.update(+id, updateLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyProgressService.remove(+id);
  }
}
