import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccountDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @MinLength(1, {
    message: 'El nombre del grupo debe tener al menos 1 carácter',
  })
  @IsNotEmpty({ message: 'El nombre del grupo es obligatorio' })
  groupName: string;
}
