import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HateoasMessage } from './types/hateoas.interface';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): HateoasMessage {
    return this.appService.getHello();
  }
}
