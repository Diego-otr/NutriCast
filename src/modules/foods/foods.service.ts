import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  // Crear un alimento en la biblioteca compartida de la cuenta
  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const newFood: Food = this.foodRepository.create(createFoodDto);
    return await this.foodRepository.save(newFood);
  }

  // Obtener todos los alimentos de UNA cuenta específica
  // Esto cumple con el requerimiento de "Lista conjunta para todos los perfiles"
  async findAllByAccount(accountId: number): Promise<Food[]> {
    return await this.foodRepository.find({
      where: { accountId },
      order: { name: 'ASC' },
    });
  }

  // Buscar un alimento específico por ID
  async findOne(id: number): Promise<Food> {
    const food: Food | null = await this.foodRepository.findOne({
      where: { id },
    });
    if (!food) {
      throw new NotFoundException(`Alimento con ID ${id} no encontrado`);
    }
    return food;
  }

  // Actualizar datos del alimento
  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food: Food = await this.findOne(id);
    const updatedFood: Food = this.foodRepository.merge(food, updateFoodDto);
    return await this.foodRepository.save(updatedFood);
  }

  // Eliminar un alimento
  async remove(id: number): Promise<void> {
    const food: Food = await this.findOne(id);
    await this.foodRepository.remove(food);
  }
}
