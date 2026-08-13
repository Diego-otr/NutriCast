import { Injectable } from '@nestjs/common';
import type { HateoasMessage } from './types/hateoas.interface';

@Injectable()
export class AppService {
  getHello(): HateoasMessage {
    return {
      message: 'API principal - enlaces disponibles',
      _links: {
        auth: { href: '/auth', method: 'GET' },
        accounts: { href: '/accounts', method: 'GET' },
        profiles: { href: '/profiles', method: 'GET' },
        foods: { href: '/foods', method: 'GET' },
        tracker: { href: '/tracker', method: 'GET' },
      },
    };
  }
}
