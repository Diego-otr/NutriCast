import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { AccountItemHateoasInterceptor } from './interceptors/account-item-hateoas.interceptor';
import { AccountDeleteHateoasInterceptor } from './interceptors/account-delete-hateoas.interceptor';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseInterceptors(AccountItemHateoasInterceptor) // <--- Interceptor Individual
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get(':id')
  @UseInterceptors(AccountItemHateoasInterceptor) // <--- Interceptor Individual
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(Number(id));
  }

  @Get(':email')
  @UseInterceptors(AccountItemHateoasInterceptor) // <--- Interceptor Individual
  findByEmail(@Param('email') email: FindByEmailDto) {
    return this.accountsService.findByEmail(email);
  }

  @Delete(':id')
  @UseInterceptors(AccountDeleteHateoasInterceptor) // <--- Interceptor de Eliminación
  remove(@Param('id') id: string) {
    return this.accountsService.remove(Number(id));
  }
}
