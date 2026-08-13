import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del alimento es obligatorio' })
  @MaxLength(40)
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional() // Puede ser opcional si el usuario prefiere cargar solo por porción
  caloriesPerGram?: number;

  @IsNumber()
  @Min(0)
  @IsOptional() // Puede ser opcional si el usuario prefiere cargar solo por gramo
  caloriesPerPortion?: number;

  @IsNumber()
  @IsNotEmpty()
  accountId: number; // El ID de la cuenta que "es dueño" de este alimento
}
