import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HateoasMessage } from './types/hateoas.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HateoasMessage {
    return this.appService.getHello();
  }
}
