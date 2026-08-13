import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Account } from '../../accounts/entities/account.entity';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'super-secret-jwt-key',
    });
  }

  async validate(payload: JwtPayload): Promise<Account> {
    const account = await this.authService.validateAccountById(payload.sub);
    if (!account) {
      throw new UnauthorizedException('Token no válido o cuenta no encontrada');
    }
    return account;
  }
}
