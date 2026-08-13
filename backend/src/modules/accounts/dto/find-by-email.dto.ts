import { IsEmail } from 'class-validator';

export class FindByEmailDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;
}
