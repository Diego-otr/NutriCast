import { IsNumber, IsNotEmpty } from 'class-validator';

export class CloseDayDto {
  @IsNumber()
  @IsNotEmpty()
  profileId: number;
}
