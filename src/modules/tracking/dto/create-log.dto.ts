import { IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateLogDto {
  @IsNumber()
  @IsNotEmpty()
  foodId: number;

  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @IsNumber()
  @Min(0.1, { message: 'La cantidad en gramos debe ser mayor a 0' })
  @IsOptional()
  amountGrams?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  portions?: number;
}
