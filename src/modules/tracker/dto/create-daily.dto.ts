import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
export class CreateDailyDto {
  @IsString()
  @IsNotEmpty()
  referenceDate: string;

  @IsNumber()
  @IsNotEmpty()
  profileId: number;
}
