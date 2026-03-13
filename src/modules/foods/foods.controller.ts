import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodsService.create(createFoodDto);
  }

  @Get('account/:accountId')
  findAllByAccount(
    @Param('accountId') accountIdParam: string,
  ): Promise<Food[]> {
    const accountId: number = parseInt(accountIdParam, 10);
    return this.foodsService.findAllByAccount(accountId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Food> {
    return this.foodsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ): Promise<Food> {
    return this.foodsService.update(Number(id), updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.foodsService.remove(Number(id));
  }
}
