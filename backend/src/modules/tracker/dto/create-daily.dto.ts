import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateDailyDto {
  @IsString()
  @IsNotEmpty()
  referenceDate: string;

  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @IsNumber()
  @IsOptional()
  targetCal?: number;
}
