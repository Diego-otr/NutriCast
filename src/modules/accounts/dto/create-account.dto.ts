import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAccountDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
