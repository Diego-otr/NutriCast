import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../accounts/entities/account.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registrar una nueva cuenta con hashing de contraseña, nombre de grupo y perfil inicial
   */
  async register(registerDto: RegisterDto) {
    const { email, password, groupName } = registerDto;

    // Verificar si el email ya existe
    const existingAccount = await this.accountRepository.findOne({
      where: { email },
    });

    if (existingAccount) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear la nueva cuenta
    const newAccount = this.accountRepository.create({
      email,
      password: hashedPassword,
      groupName,
    });
    const savedAccount = await this.accountRepository.save(newAccount);

    // Crear automáticamente un perfil inicial por defecto para la cuenta
    const defaultProfile = this.profileRepository.create({
      name: 'Usuario 1',
      accountId: savedAccount.id,
    });
    await this.profileRepository.save(defaultProfile);

    // Generar Token JWT
    const payload = { sub: savedAccount.id, email: savedAccount.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Cuenta registrada exitosamente',
      accessToken,
      account: {
        id: savedAccount.id,
        email: savedAccount.email,
        groupName: savedAccount.groupName,
      },
      _links: {
        login: { href: '/auth/login', method: 'POST' },
        me: { href: '/auth/me', method: 'GET' },
        profiles: {
          href: `/profiles/account/${savedAccount.id}`,
          method: 'GET',
        },
      },
    };
  }

  /**
   * Autenticar credenciales y generar Token JWT
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar la cuenta incluyendo la columna password (select: false en entity)
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .addSelect('account.password')
      .where('account.email = :email', { email })
      .getOne();

    if (!account) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Comparar contraseña con el hash guardado
    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Generar Token JWT
    const payload = { sub: account.id, email: account.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      accessToken,
      account: {
        id: account.id,
        email: account.email,
        groupName: account.groupName,
      },
      _links: {
        me: { href: '/auth/me', method: 'GET' },
        profiles: { href: `/profiles/account/${account.id}`, method: 'GET' },
        foods: { href: `/foods/account/${account.id}`, method: 'GET' },
      },
    };
  }

  /**
   * Validar y obtener datos de la cuenta por ID (usado por JwtStrategy)
   */
  async validateAccountById(id: number): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });
  }
}
