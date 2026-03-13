import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import {} from 'class-validator';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}
