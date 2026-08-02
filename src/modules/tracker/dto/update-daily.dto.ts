import {
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ConsumptionLog } from '../entities/consumption-log.entity';
import { CreateDailyDto } from './create-daily.dto';
import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper';

export class UpdateDailyDto extends PartialType(CreateDailyDto) {
  @IsNumber()
  @IsOptional()
  targetCal?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalCaloriesSum?: number;

  @IsBoolean()
  isFinalized?: boolean;

  @IsBoolean()
  isSkiped?: boolean;

  @IsArray()
  @IsOptional()
  logs?: ConsumptionLog[];
}
