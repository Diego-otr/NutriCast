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
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FoodItemHateoasInterceptor } from './interceptors/food-item-hateoas.interceptor';
import { FoodCollectionHateoasInterceptor } from './interceptors/food-collection-hateoas.interceptor';
import { FoodDeleteHateoasInterceptor } from './interceptors/food-delete-hateoas.interceptor';
import { Food } from './entities/food.entity';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FoodItemHateoasInterceptor) // <--- Interceptor Individual
  async create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodsService.create(createFoodDto);
  }

  @Get('account/:accountId')
  @UseInterceptors(FoodCollectionHateoasInterceptor) // <--- Interceptor de Colección
  async findAllByAccount(
    @Param('accountId') accountIdParam: string,
  ): Promise<Food[]> {
    const accountId: number = parseInt(accountIdParam, 10);
    return this.foodsService.findAllByAccount(accountId);
  }

  @Get(':id')
  @UseInterceptors(FoodItemHateoasInterceptor) // <--- Interceptor Individual
  async findOne(@Param('id') id: string): Promise<Food> {
    return this.foodsService.findOne(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(FoodItemHateoasInterceptor) // <--- Interceptor Individual
  async update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ): Promise<Food> {
    return this.foodsService.update(Number(id), updateFoodDto);
  }

  @Delete(':id')
  @UseInterceptors(FoodDeleteHateoasInterceptor) // <--- Interceptor de Eliminación
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.foodsService.remove(Number(id));
    return {
      message: `Alimento con ID ${id} eliminado correctamente`,
    };
  }
}
