import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser un email válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;

  @IsString()
  @MinLength(1, {
    message: 'El nombre del grupo debe tener al menos 1 carácter.',
  })
  @IsNotEmpty({ message: 'El nombre del grupo es obligatorio.' })
  groupName: string;
}
