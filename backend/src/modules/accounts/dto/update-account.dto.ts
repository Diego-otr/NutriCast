import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @MinLength(1, {
    message: 'El nombre del grupo debe tener al menos 1 carácter',
  })
  @IsOptional()
  groupName?: string;
}
