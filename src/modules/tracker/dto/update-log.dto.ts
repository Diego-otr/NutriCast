import { PartialType } from '@nestjs/mapped-types';
import { CreateLogDto } from './create-log.dto';
import { IsBoolean } from 'class-validator';

export class UpdateLogDto extends PartialType(CreateLogDto) {
  @IsBoolean()
  perPortions: boolean;
}
