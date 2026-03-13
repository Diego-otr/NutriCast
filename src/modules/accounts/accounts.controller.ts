import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(Number(id));
  }

  @Get(':email')
  findByEmail(@Param('email') email: FindByEmailDto) {
    return this.accountsService.findByEmail(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(Number(id));
  }
}
