import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Length,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del perfil es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  @Length(4, 4, { message: 'El PIN debe ser de 4 dígitos' })
  pinCode?: string;

  @IsNumber()
  @IsNotEmpty()
  accountId: number;
}
