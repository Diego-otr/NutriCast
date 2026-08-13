import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentAccount } from './decorators/current-account.decorator';
import { Account } from '../accounts/entities/account.entity';
import type { HateoasMessage } from '../../types/hateoas.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get()
  getHateoasLinks(): HateoasMessage {
    return {
      message: 'Enlaces disponibles para autenticación',
      _links: {
        register: { href: '/auth/register', method: 'POST' },
        login: { href: '/auth/login', method: 'POST' },
        me: { href: '/auth/me', method: 'GET' },
      },
    };
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  getProfile(@CurrentAccount() account: Account) {
    return {
      account: {
        id: account.id,
        email: account.email,
        groupName: account.groupName,
        createdAt: account.createdAt,
        profiles: account.profiles || [],
      },
      _links: {
        profiles: { href: `/profiles/account/${account.id}`, method: 'GET' },
        foods: { href: `/foods/account/${account.id}`, method: 'GET' },
      },
    };
  }
}
