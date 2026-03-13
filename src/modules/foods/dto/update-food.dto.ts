import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del alimento es obligatorio' })
  @MaxLength(40)
  @IsOptional() // En la actualización, el nombre también puede ser opcional
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  caloriesPerGram?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  caloriesPerPortion?: number;
}
